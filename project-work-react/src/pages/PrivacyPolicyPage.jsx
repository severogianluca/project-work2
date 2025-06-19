import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicyPage() {
    const companyName = "Manga E-Commerce S.R.L.";
    const appName = "Manga E-Commerce";
    const websiteUrl = "MangaE-Commerce.com";
    const contactEmail = "ecommerce.manga@gmail.com";
    const lastUpdated = "31 Maggio 2025";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container my-5">
            <div className="alert alert-warning text-center fw-bold" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                ATTENZIONE: Questo è un esempio di testo fittizio per una Privacy Policy e NON ha valore legale.
            </div>

            <header className="text-center border-bottom pb-3 mb-4">
                <h1><i className="fas fa-shield-alt me-2"></i>Informativa sulla Privacy e Trattamento dei Dati Personali</h1>
                <p className="lead">per {appName}</p>
            </header>

            <section className="mb-4">
                <p>
                    Benvenuto su {appName}! La tua privacy è molto importante per noi di {companyName} ("noi", "ci", o "nostro").
                    Questa Informativa sulla Privacy descrive come raccogliamo, utilizziamo, divulghiamo e proteggiamo
                    le tue informazioni personali quando utilizzi il nostro sito web {websiteUrl} (il "Sito") per acquistare manga.
                </p>
                <p>
                    Utilizzando il nostro Sito e procedendo con un acquisto, acconsenti alla raccolta e all'utilizzo delle informazioni
                    in conformità con questa informativa. Non è prevista la creazione di un account utente per utilizzare i nostri servizi.
                </p>
                <p>
                    <strong className="fw-bold">Ultimo aggiornamento:</strong> {lastUpdated}
                </p>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-info-circle me-2"></i>1. Informazioni che Raccogliamo</h2>
                <p>
                    Raccogliamo solo le informazioni strettamente necessarie per processare i tuoi ordini e migliorare la tua esperienza sul nostro e-commerce.
                </p>
                <h3 className="h4 mt-3">A. Dati Forniti Volontariamente dall'Utente</h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <i className="fas fa-shopping-cart me-2 text-primary"></i><strong className="fw-bold">Informazioni per l'ordine:</strong> Durante il processo di checkout, ti chiederemo di fornire le informazioni necessarie per completare il tuo acquisto, come nome, cognome, indirizzo email (per le conferme d'ordine) e indirizzo di spedizione.
                    </li>
                    <li className="list-group-item">
                        <i className="fas fa-credit-card me-2 text-primary"></i><strong className="fw-bold">Informazioni di pagamento (fittizie):</strong> Per completare l'acquisto (in modo simulato), ti verranno richieste informazioni di pagamento. Precisiamo che {appName} non memorizza direttamente i dati completi della tua carta di credito; questi vengono gestiti tramite un processore di pagamento terzo fittizio e sicuro. Raccogliamo solo una conferma di avvenuto pagamento fittizio.
                    </li>
                    <li className="list-group-item">
                        <i className="fas fa-comments me-2 text-primary"></i><strong className="fw-bold">Comunicazioni:</strong> Se ci contatti per assistenza o informazioni, potremmo conservare una traccia di tale corrispondenza (es. indirizzo email, contenuto del messaggio) per fornirti supporto.
                    </li>
                </ul>
                <h3 className="h4 mt-4">B. Dati Raccolti Automaticamente</h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <i className="fas fa-chart-bar me-2 text-info"></i><strong className="fw-bold">Dati di utilizzo del sito:</strong> Raccogliamo informazioni su come interagisci con il nostro Sito.
                        Questi dati possono includere l'indirizzo IP del tuo dispositivo, tipo di browser, versione del browser, le pagine del nostro Sito che visiti (es. pagine dei manga, carrello), l'ora e la data della tua visita,
                        il tempo trascorso su tali pagine, e altri dati diagnostici. Questi dati ci aiutano a capire come viene usato il sito e a migliorarlo.
                    </li>
                    <li className="list-group-item">
                        <i className="fas fa-cookie-bite me-2 text-info"></i><strong className="fw-bold">Cookie e Tecnologie Simili:</strong> Utilizziamo cookie fittizi e tecnologie di tracciamento simili
                        per il corretto funzionamento del carrello (ad esempio, per ricordare gli articoli che hai aggiunto) e per analizzare l'attività sul nostro Sito.
                        I cookie sono file con una piccola quantità di dati. Puoi istruire il tuo browser a rifiutare tutti i cookie o a indicare quando un cookie viene inviato.
                        Tuttavia, se non accetti i cookie, alcune funzionalità essenziali del nostro e-commerce (come il carrello) potrebbero non funzionare correttamente. Non usiamo cookie per tracciare preferenze personali legate a un profilo utente, dato che non esistono profili.
                    </li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-cogs me-2"></i>2. Come Utilizziamo le Tue Informazioni</h2>
                <p>
                    {companyName} utilizza i dati raccolti (sempre in modo fittizio) per i seguenti scopi:
                </p>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><i className="fas fa-box-open me-2 text-success"></i>Per elaborare e gestire i tuoi ordini di manga (fittizi), inclusa la spedizione e la fatturazione.</li>
                    <li className="list-group-item"><i className="fas fa-headset me-2 text-success"></i>Per fornire assistenza clienti e rispondere alle tue richieste.</li>
                    <li className="list-group-item"><i className="fas fa-tools me-2 text-success"></i>Per mantenere e migliorare il funzionamento del nostro Sito, inclusa la funzionalità del carrello.</li>
                    <li className="list-group-item"><i className="fas fa-chart-line me-2 text-success"></i>Per raccogliere analisi sull'utilizzo del Sito al fine di migliorarlo.</li>
                    <li className="list-group-item"><i className="fas fa-user-shield me-2 text-success"></i>Per rilevare, prevenire e affrontare problemi tecnici o tentativi di frode (simulati).</li>
                    <li className="list-group-item"><i className="fas fa-envelope-open-text me-2 text-success"></i>Per inviarti comunicazioni relative ai tuoi ordini (es. conferme, aggiornamenti sulla spedizione fittizia). Non invieremo email promozionali se non esplicitamente richiesto durante il checkout (funzionalità fittizia).</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-share-alt me-2"></i>3. Condivisione delle Tue Informazioni</h2>
                <p>
                    Potremmo condividere le tue informazioni personali fittizie nelle seguenti situazioni simulate e solo quando strettamente necessario:
                </p>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <strong className="fw-bold">Con Fornitori di Servizi Fittizi:</strong> Potremmo condividere le tue informazioni con
                        aziende terze fittizie che ci aiutano a operare il nostro e-commerce, come:
                        <ul className="list-group list-group-flush mt-2">
                            <li className="list-group-item ps-4"><i className="fas fa-credit-card me-2 text-secondary"></i>Processori di pagamento fittizi (per elaborare i pagamenti simulati).</li>
                            <li className="list-group-item ps-4"><i className="fas fa-truck me-2 text-secondary"></i>Servizi di spedizione fittizi (per consegnare i tuoi ordini).</li>
                            <li className="list-group-item ps-4"><i className="fas fa-server me-2 text-secondary"></i>Fornitori di hosting e manutenzione del sito.</li>
                        </ul>
                        Questi terzi fittizi hanno accesso alle tue informazioni personali solo per eseguire questi compiti per nostro conto e sono obbligati (in modo fittizio) a non divulgarle o utilizzarle per altri scopi.
                    </li>
                    <li className="list-group-item">
                        <strong className="fw-bold">Per Trasferimenti Aziendali Fittizi:</strong> Se {companyName} è coinvolta in una fusione,
                        acquisizione o vendita di attività fittizia, le tue informazioni personali potrebbero essere trasferite.
                    </li>
                    <li className="list-group-item">
                        <strong className="fw-bold">Per Requisiti Legali (Simulati):</strong> {companyName} può divulgare le tue informazioni
                        personali in buona fede ritenendo che tale azione sia necessaria per adempiere a un obbligo legale simulato, proteggere i nostri diritti, prevenire frodi o proteggere la sicurezza pubblica.
                    </li>
                </ul>
                <p className="mt-3">
                    <strong className="fw-bold">Non vendiamo le tue informazioni personali fittizie a terzi.</strong>
                </p>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-lock me-2"></i>4. Sicurezza dei Dati (Simulata)</h2>
                <p>
                    La sicurezza dei tuoi dati è importante per noi. Adottiamo misure di sicurezza fittizie ragionevoli per proteggere le informazioni che raccogliamo. Tuttavia, ricorda che nessun metodo di trasmissione
                    su Internet o metodo di archiviazione elettronica è sicuro al 100%.
                </p>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-user-check me-2"></i>5. I Tuoi Diritti (Fittizi)</h2>
                <p>
                    Anche se non è prevista la creazione di un account, hai comunque dei diritti (fittizi) riguardo ai dati personali che potremmo aver raccolto durante un tuo ordine:
                </p>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><i className="fas fa-eye me-2 text-warning"></i>Il diritto di richiedere l'accesso alle informazioni personali relative ai tuoi ordini fittizi.</li>
                    <li className="list-group-item"><i className="fas fa-edit me-2 text-warning"></i>Il diritto di richiedere la rettifica di informazioni imprecise relative ai tuoi ordini fittizi (es. indirizzo di spedizione prima della spedizione simulata).</li>
                    <li className="list-group-item"><i className="fas fa-trash-alt me-2 text-warning"></i>Il diritto di richiedere la cancellazione dei tuoi dati personali relativi agli ordini fittizi, soggetti a determinati obblighi legali o operativi simulati (es. conservazione per finalità fiscali fittizie).</li>
                </ul>
                <p className="mt-3">
                    Per esercitare questi diritti fittizi, puoi contattarci all'indirizzo <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Potremmo chiederti di verificare la tua identità (in modo simulato) prima di rispondere a tali richieste.
                </p>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-child me-2"></i>6. Privacy dei Minori (Simulata)</h2>
                <p>
                    Il nostro Sito non si rivolge intenzionalmente a persone di età inferiore ai 16 anni ("Minori") senza il consenso dei genitori, specialmente per quanto riguarda l'effettuazione di acquisti.
                    Non raccogliamo consapevolmente informazioni personali identificabili da Minori senza tale consenso.
                    Se sei un genitore o tutore e sei consapevole che tuo figlio ci ha fornito Informazioni Personali per un acquisto,
                    ti preghiamo di contattarci. Se veniamo a conoscenza di aver raccolto Informazioni Personali
                    da Minori per un acquisto senza la verifica del consenso genitoriale, adottiamo misure (simulate) per rimuovere
                    tali informazioni e annullare l'ordine fittizio.
                </p>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-file-alt me-2"></i>7. Modifiche a Questa Informativa sulla Privacy</h2>
                <p>
                    Potremmo aggiornare la nostra Informativa sulla Privacy di volta in volta. Ti informeremo di eventuali
                    modifiche pubblicando la nuova Informativa sulla Privacy su questa pagina.
                </p>
                <p>
                    Ti consigliamo di rivedere periodicamente questa Informativa sulla Privacy per eventuali modifiche.
                    Le modifiche a questa Informativa sulla Privacy entrano in vigore quando vengono pubblicate su questa pagina.
                </p>
            </section>

            <section className="mb-4">
                <h2 className="border-bottom pb-2 mb-3"><i className="fas fa-envelope me-2"></i>8. Contattaci (Informazioni Fittizie)</h2>
                <p>
                    Se hai domande su questa Informativa sulla Privacy fittizia, puoi contattarci:
                </p>
                <ul className="list-unstyled">
                    <li className="mb-2"><i className="fas fa-envelope-open-text me-2 text-primary"></i>Tramite email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
                    <li className="mb-2"><i className="fas fa-globe me-2 text-primary"></i>Visitando la sezione contatti sul nostro sito web fittizio: <Link className='text-decoration-underline' to={'/contacts'}>Pagina Contatti</Link></li>
                    <li className="mb-2"><i className="fas fa-building me-2 text-primary"></i>Sede legale: Via Luca Signorelli, 12, 00196 Roma (RM), Italia</li>
                </ul>
            </section>

            <footer className="text-center text-muted py-4 mt-5 border-top">
                <p>&copy; {new Date().getFullYear()} {appName} by {companyName}. Tutti i diritti fittizi riservati.</p>
                <p>Questo documento è puramente dimostrativo e non ha validità legale.</p>
            </footer>
        </div>
    );
}

export default PrivacyPolicyPage;