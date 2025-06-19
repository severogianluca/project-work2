const connection = require('../data/db');
const nodemailer = require('nodemailer');

// Configurazione del transporter Nodemailer - USARE VARIABILI D'AMBIENTE PER LE CREDENZIALI!
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Funzione helper per gestire gli errori del database
function handleDbError(res, err, message) {
    console.error(`Errore nel ${message}:`, err);
    res.status(500).json({
        error: `Errore nella query del database per ${message}`,
        details: err.message
    });
}

function index(req, res) {
    const {
        search,
        page,
        limit,
        max_price,
        editorial_line,
        has_discount
    } = req.query;
    let order = req.query.order;

    const validOrders = [
        "order_price ASC",
        "order_price DESC",
        "manga.title ASC",
        "manga.title DESC",
        "manga.release_date ASC",
        "manga.release_date DESC"
    ];

    if (!validOrders.includes(order)) {
        order = 'manga.description ASC';
    }

    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 20;
    const offset = (currentPage - 1) * itemsPerPage;

    let whereClauses = [];
    const queryParams = [];

    if (search) {
        whereClauses.push(`
            (
                manga.title LIKE ? OR
                series.name LIKE ? OR
                EXISTS (
                    SELECT 1
                    FROM series_genre sg_search
                    INNER JOIN genre g_search ON sg_search.genre_id = g_search.id
                    WHERE sg_search.series_id = series.id AND g_search.genre LIKE ?
                )
            )
        `);
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (max_price) {
        whereClauses.push(`
                (CASE
                    WHEN manga.discount IS NOT NULL AND manga.discount > 0 THEN manga.price * (1 - manga.discount / 100.0)
                    ELSE manga.price
                END) <= ?
            `);
        queryParams.push(parseFloat(max_price));
    }

    if (editorial_line) {
        whereClauses.push(`
                EXISTS (
                    SELECT 1
                    FROM series_genre sg_filter
                    INNER JOIN genre g_filter ON sg_filter.genre_id = g_filter.id
                    WHERE sg_filter.series_id = series.id AND g_filter.genre = ?
                )
            `);
        queryParams.push(editorial_line);
    }

    if (has_discount !== undefined && has_discount !== null) {
        if (has_discount === 'true') {
            whereClauses.push(`(manga.discount IS NOT NULL AND manga.discount > 0)`);
        } else if (has_discount === 'false') {
            whereClauses.push(`(manga.discount IS NULL OR manga.discount = 0)`);
        }
    }

    const whereClauseString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const priceCalculation = `
            CASE
                WHEN manga.discount IS NOT NULL AND manga.discount > 0 THEN ROUND(manga.price * (1 - manga.discount / 100.0), 2)
                ELSE manga.price
            END
        `;

    // Query per il conteggio totale degli elementi
    let countSql = `
        SELECT COUNT(DISTINCT manga.id) AS totalItems
        FROM
            manga
        INNER JOIN series ON manga.series_id = series.id
        ${whereClauseString};
    `;
    const countQueryParams = [...queryParams]; // Parametri per la query di conteggio

    connection.query(countSql, countQueryParams, (errCount, countResults) => {
        if (errCount) {
            return handleDbError(res, errCount, 'conteggio totale degli elementi');
        }

        const totalItems = countResults[0]?.totalItems || 0;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalItems === 0) {
            return res.json({
                items: [],
                totalItems: 0,
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                totalPages: 0
            });
        }

        // Query per gli elementi paginati
        let itemsSql = `
            SELECT
                manga.*,
                series.name AS series_name,
                series.number_volumes,
                series.description AS series_description,
                (SELECT JSON_ARRAYAGG(g.genre) FROM genre g JOIN series_genre sg ON sg.genre_id = g.id WHERE sg.series_id = series.id) AS genres_array,
                ${priceCalculation} AS effective_price,
                ${priceCalculation} AS order_price
            FROM
                manga
            INNER JOIN series ON manga.series_id = series.id
            ${whereClauseString}
            GROUP BY
                manga.id, series.id
            ORDER BY
                ${order}
            LIMIT ? OFFSET ?;
        `;

        const itemsQueryParams = [...queryParams, itemsPerPage, offset]; // Parametri per la query degli elementi

        connection.query(itemsSql, itemsQueryParams, (errItems, itemsResults) => {
            if (errItems) {
                return handleDbError(res, errItems, 'recupero degli elementi paginati');
            }

            const paginatedManga = itemsResults.map(item => ({
                ...item,
                price: item.price,
                discount: item.discount,
                effective_price: item.effective_price,
                // Assicurati che process.env.PUBLIC_PATH sia impostato correttamente
                imagePath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH + item.image : `/images/${item.image}`
            }));

            res.json({
                items: paginatedManga,
                totalItems: totalItems,
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                totalPages: totalPages
            });
        });
    });
}

function show(req, res) {
    const priceCalculation = `
            CASE
                WHEN manga.discount IS NOT NULL AND manga.discount > 0 THEN ROUND(manga.price * (1 - manga.discount / 100.0), 2)
                ELSE manga.price
            END
        `;

    const slug = req.params.slug;
    const sql = `
        SELECT
            manga.*,
            series.number_volumes,
            series.description AS series_description,
            series.author,
            JSON_ARRAYAGG(genre.genre) AS genres_array,
            ${priceCalculation} AS effective_price,
            ${priceCalculation} AS order_price
        FROM
            manga
        INNER JOIN series ON manga.series_id = series.id
        INNER JOIN series_genre ON series.id = series_genre.series_id
        INNER JOIN genre ON series_genre.genre_id = genre.id
        WHERE
            manga.slug = ?
        GROUP BY
            manga.id; -- Aggiunto GROUP BY per evitare duplicati se un manga ha più generi
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) {
            return handleDbError(res, err, 'dettagli del manga');
        }
        if (results.length === 0) return res.status(404).json({ error: 'Manga non trovato' });

        res.json({
            ...results[0],
            imagePath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH + results[0].image : `/images/${results[0].image}`
        });
    });
}

function getSeries(req, res) {
    const sql = `
        SELECT *
        FROM
            series s
        ORDER BY s.name ASC;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return handleDbError(res, err, 'recupero delle serie');
        }

        res.json(results.map(result => ({
            ...result,
            imagePath: result.image_series ? process.env.PUBLIC_PATH + result.image_series : undefined
        })));
    });
}

function newRelease(req, res) {
    const sql = `
        SELECT *
        FROM manga
        ORDER BY release_date DESC
        LIMIT 10;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return handleDbError(res, err, 'recupero delle nuove uscite');
        }

        const formattedResults = results.map(result => ({
            ...result,
            imagePath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH + result.image : `/images/${result.image}`
        }));

        res.json(formattedResults);
    });
}

function getMangaBySeries(req, res) {
    const priceCalculation = `
            CASE
                WHEN manga.discount IS NOT NULL AND manga.discount > 0 THEN ROUND(manga.price * (1 - manga.discount / 100.0), 2)
                ELSE manga.price
            END
        `;

    const seriesSlug = req.params.slug;

    const seriesSql = `SELECT * FROM series WHERE slug = ?`;
    const mangaSql = `
        SELECT
            manga.*,
            JSON_ARRAYAGG(genre.genre) AS genres_array,
            ${priceCalculation} AS effective_price,
            ${priceCalculation} AS order_price
        FROM
            manga
        INNER JOIN series ON manga.series_id = series.id
        INNER JOIN series_genre ON series.id = series_genre.series_id
        INNER JOIN genre ON series_genre.genre_id = genre.id
        WHERE
            series.slug = ?
        GROUP BY
            manga.id;
    `;

    connection.query(seriesSql, [seriesSlug], (errSeries, seriesResults) => {
        if (errSeries) {
            return handleDbError(res, errSeries, 'recupero della serie');
        }

        if (seriesResults.length === 0) {
            return res.status(404).json({ error: 'Serie non trovata' });
        }

        const seriesData = {
            ...seriesResults[0],
            // Aggiungi imagePath per la serie
            imagePath: seriesResults[0].image_series ? process.env.PUBLIC_PATH + seriesResults[0].image_series : undefined
        };

        connection.query(mangaSql, [seriesSlug], (errManga, mangaResults) => {
            if (errManga) {
                return handleDbError(res, errManga, 'recupero dei manga per serie');
            }

            const mangaWithImages = mangaResults.map(manga => ({
                ...manga,
                imagePath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH + manga.image : `/images/${manga.image}`
            }));

            res.json({
                series: seriesData,
                manga: mangaWithImages
            });
        });
    });
}

function getPopularity(req, res) {
    const sql = `
        SELECT *
        FROM manga
        ORDER BY popularity DESC
        LIMIT 10;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return handleDbError(res, err, 'recupero della popolarità');
        }

        const formattedResults = results.map(result => ({
            ...result,
            imagePath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH + result.image : `/images/${result.image}`
        }));

        res.json(formattedResults);
    });
}


function getGenre(req, res) {
    const sql = `
        SELECT DISTINCT g.genre
        FROM genre g
        INNER JOIN series_genre sg ON g.id = sg.genre_id
        -- Puoi aggiungere un'altra JOIN con 'series' se vuoi assicurarti che siano solo i generi di serie valide
        -- ma la INNER JOIN con series_genre è spesso sufficiente se series_genre ha chiavi esterne valide.
        -- Se vuoi solo generi di manga che hanno un volume disponibile, potresti fare JOIN con 'manga'
        -- INNER JOIN series s ON sg.series_id = s.id
        ORDER BY g.genre ASC;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Errore nella query getGenre:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const genres = results.map(row => row.genre);
        res.json(genres);
    });
}

function createOrder(req, res) {
    // SECURITY: Valida i dati in ingresso con un middleware prima di questo punto.
    const { total_amount, shipping_price, payment_method, address, email, name, surname, promo_code_id, cartItems } = req.body;

    // TODO: Considerare l'uso di transazioni per gli ordini che coinvolgono più tabelle (es. orders e order_items)
    const sql = `
        INSERT INTO orders (total_amount, shipping_price, payment_method, address, email, name, surname, promo_code_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [total_amount, shipping_price, payment_method, address, email, name, surname, promo_code_id], (err, result) => {
        if (err) {
            return handleDbError(res, err, 'inserimento ordine');
        }

        const orderId = result.insertId;

        // --- INIZIO EMAIL AL CLIENTE MIGLIORATA ---
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🎉 Il tuo Ordine su E-commerce Manga è Confermato!`,
            html: `
        <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <header style="background-color: #f4a261; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Grazie per il tuo acquisto, ${name}!</h1>
            </header>
            <div style="padding: 25px;">
                <p style="font-size: 18px;">Ciao ${name},</p>
                <p>Siamo felicissimi di confermare che il tuo ordine è stato ricevuto e verrà processato il prima possibile.</p>
                
                <h2 style="color: #e76f51; border-bottom: 2px solid #f4a261; padding-bottom: 5px; margin-top: 30px;">Riepilogo Ordine</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #eee;">Prodotto</th>
                            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">Prezzo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartItems.map(item => `
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title} (x${item.quantity})</td>
                                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${item.effective_price.toFixed(2)} €</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <table style="width: 100%; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                    <tr>
                        <td style="padding: 5px 0;">Subtotale:</td>
                        <td style="text-align: right; padding: 5px 0;">${(total_amount - shipping_price).toFixed(2)} €</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;">Spedizione:</td>
                        <td style="text-align: right; padding: 5px 0;">${shipping_price === 0 ? 'Gratuita' : shipping_price.toFixed(2) + ' €'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-size: 18px;"><strong>Totale Ordine:</strong></td>
                        <td style="text-align: right; padding: 8px 0; font-size: 18px;"><strong>${total_amount.toFixed(2)} €</strong></td>
                    </tr>
                </table>

                <h3 style="color: #2a9d8f; margin-top: 30px;">Dettagli Spedizione e Pagamento</h3>
                <p><strong>Metodo di Pagamento:</strong> ${payment_method}</p>
                <p><strong>Indirizzo di Spedizione:</strong><br>
                    ${name} ${surname}<br>
                    ${address}
                </p>

                <p style="margin-top: 30px;">Riceverai un'email di conferma non appena il tuo ordine sarà spedito. Nel frattempo, puoi controllare lo stato del tuo ordine <a href="[LINK_ALLA_PAGINA_ORDINI]" style="color: #e76f51; text-decoration: none;">cliccando qui</a>.</p>
                <p>Grazie ancora per aver scelto <strong>E-commerce Manga</strong>!</p>
            </div>
            <footer style="background-color: #264653; color: white; text-align: center; padding: 15px; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} E-commerce Manga. Tutti i diritti riservati.</p>
                <p>Seguici sui social! </p>
            </footer>
        </div>
        `
        };

        transporter.sendMail(customerMailOptions, (error, info) => {
            if (error) console.error('Errore invio email cliente:', error);
        });
        // --- FINE EMAIL AL CLIENTE MIGLIORATA ---

        // --- INIZIO EMAIL AL PROPRIETARIO MIGLIORATA ---
        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL, // Assicurati che OWNER_EMAIL sia configurata
            subject: `🔔 NUOVO ORDINE RICEVUTO! - ID: ${orderId}`,
            html: `
        <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 2px solid #4CAF50; border-radius: 5px;">
            <header style="background-color: #4CAF50; color: white; padding: 15px; text-align: center;">
                <h1 style="margin: 0; font-size: 22px;">🚀 Nuovo Ordine Ricevuto!</h1>
            </header>
            <div style="padding: 20px;">
                <p style="font-size: 16px;">Un nuovo ordine con <strong>ID ${orderId}</strong> è stato appena effettuato sul tuo sito E-commerce Manga.</p>
                
                <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px; font-size: 18px;">Dettagli Cliente:</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <tr><td style="padding: 6px; font-weight: bold;">Nome:</td><td style="padding: 6px;">${name} ${surname}</td></tr>
                    <tr><td style="padding: 6px; font-weight: bold;">Email:</td><td style="padding: 6px;"><a href="mailto:${email}" style="color: #1E88E5;">${email}</a></td></tr>
                    <tr><td style="padding: 6px; font-weight: bold; vertical-align: top;">Indirizzo:</td><td style="padding: 6px;">${address}</td></tr>
                </table>

                <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px; font-size: 18px;">Dettagli Ordine (ID: ${orderId}):</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 8px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Prodotto</th>
                            <th style="text-align: center; padding: 8px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Qtà</th>
                            <th style="text-align: right; padding: 8px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">Prezzo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartItems.map(item => `
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
                                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${item.effective_price.toFixed(2)} €</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <table style="width: 100%; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
                    <tr>
                        <td style="padding: 5px 0;">Subtotale:</td>
                        <td style="text-align: right; padding: 5px 0;">${(total_amount - shipping_price).toFixed(2)} €</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;">Spedizione:</td>
                        <td style="text-align: right; padding: 5px 0;">${shipping_price === 0 ? 'Gratuita' : shipping_price.toFixed(2) + ' €'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-size: 16px; font-weight: bold;">Totale Ordine:</td>
                        <td style="text-align: right; padding: 8px 0; font-size: 16px; font-weight: bold;">${total_amount.toFixed(2)} €</td>
                    </tr>
                </table>

                <p style="margin-top: 15px;"><strong>Metodo di Pagamento:</strong> ${payment_method}</p>
                ${promo_code_id ? `<p><strong>Codice Promo Utilizzato (ID):</strong> ${promo_code_id}</p>` : ''}
                
                <p style="text-align: center; margin-top: 25px;">
                    <a href="[LINK_AL_PANNELLO_ADMIN_ORDINE_SPECIFICO_CON_ID_${orderId}]" style="background-color: #1E88E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px;">Visualizza Ordine nel Pannello Admin</a>
                </p>
            </div>
            <footer style="background-color: #f0f0f0; text-align: center; padding: 10px; font-size: 12px; border-top: 1px solid #ddd;">
                <p>Questa è una notifica automatica dal tuo E-commerce Manga.</p>
            </footer>
        </div>
        `
        };

        transporter.sendMail(ownerMailOptions, (error, info) => {
            if (error) console.error('Errore invio email proprietario:', error);
        });
        // --- FINE EMAIL AL PROPRIETARIO MIGLIORATA ---

        res.status(201).json({ message: 'Ordine inserito con successo', orderId: orderId });
    });
}

function getPromoCode(req, res) {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: 'Promo code mancante' });
    }

    const sql = `SELECT * FROM promo_code WHERE name = ? LIMIT 1`;

    connection.query(sql, [code], (err, results) => {
        if (err) {
            return handleDbError(res, err, 'recupero codice promozionale');
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Codice promo non trovato' });
        }

        const promo = results[0];
        const now = new Date();

        // Controllo validità date
        if (promo.start_date && now < new Date(promo.start_date)) {
            return res.status(400).json({ error: 'Codice promo non ancora valido' });
        }
        if (promo.end_date && now > new Date(promo.end_date)) {
            return res.status(400).json({ error: 'Codice promo scaduto' });
        }

        res.json({
            id: promo.id,
            name: promo.name,
            value_promo: promo.value_promo, // <-- questo campo serve al frontend
            start_date: promo.start_date,
            end_date: promo.end_date
        });
    });
}

function getPromoCode(req, res) {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: 'Promo code mancante' });
    }

    const sql = `SELECT * FROM promo_code WHERE name = ? LIMIT 1`;

    connection.query(sql, [code], (err, results) => {
        if (err) {
            return handleDbError(res, err, 'recupero codice promozionale');
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Codice promo non trovato' });
        }

        const promo = results[0];
        const now = new Date();

        // Controllo validità date
        if (promo.start_date && now < new Date(promo.start_date)) {
            return res.status(400).json({ error: 'Codice promo non ancora valido' });
        }
        if (promo.end_date && now > new Date(promo.end_date)) {
            return res.status(400).json({ error: 'Codice promo scaduto' });
        }

        res.json({
            id: promo.id,
            name: promo.name,
            value_promo: promo.value_promo, // <-- questo campo serve al frontend
            start_date: promo.start_date,
            end_date: promo.end_date
        });
    });
}

module.exports = {
    index,
    show,
    newRelease,
    getSeries,
    getMangaBySeries,
    getPopularity,
    getGenre,
    createOrder,
    getPromoCode
};