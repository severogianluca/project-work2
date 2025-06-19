import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MangaCard from "../components/MangaCard";
import MangaListCard from "../components/MangaListCard";
import Filter from "../components/Filter";

function MangaPage() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [manga, setManga] = useState([]);
    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemPerPage] = useState(20);
    const [stagedItemsPerPage, setStagedItemsPerPage] = useState(itemsPerPage);

    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    // Stati per la gestione dei parametri URL e inizializzazione
    const [searchParams, setSearchParams] = useSearchParams();
    const [isInitialized, setIsInitialized] = useState(false);

    // Costante per il prezzo massimo di default
    const DEFAULT_MAX_PRICE = 25;

    // Stati dei filtri ATTIVI (usati per la query API e per aggiornare l'URL) 
    const [filterPriceRange, setFilterPriceRange] = useState(DEFAULT_MAX_PRICE);
    const [filterEditorialLine, setFilterEditorialLine] = useState('');
    const [filterHasDiscount, setFilterHasDiscount] = useState(null); // Può essere true, false, o null (per "qualsiasi")
    // -----------------------------------------------------------------------------

    // --- Stati STAGING per l'Offcanvas (modificati in tempo reale nell'overlay prima dell'applicazione) ---
    const [stagedFilterPriceRange, setStagedFilterPriceRange] = useState(DEFAULT_MAX_PRICE);
    const [stagedFilterEditorialLine, setStagedFilterEditorialLine] = useState('');
    const [stagedFilterHasDiscount, setStagedFilterHasDiscount] = useState(null);
    // ----------------------------------------------------------------------------------------------------

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Effetto per leggere i parametri URL all'avvio e inizializzare gli stati
    useEffect(() => {
        const urlOrder = searchParams.get('order') || '';
        const urlSearch = searchParams.get('search') || '';
        const urlPage = parseInt(searchParams.get('page')) || 1;
        const urlView = searchParams.get('view') || 'grid';
        const urlPriceRange = parseInt(searchParams.get('priceRange')) || DEFAULT_MAX_PRICE;
        const urlEditorialLine = searchParams.get('editorialLine') || '';
        const urlHasDiscountParam = searchParams.get('hasDiscount'); // Sarà 'true', 'false', o null

        setOrder(urlOrder);
        setSearch(urlSearch);
        setCurrentPage(urlPage);
        setViewMode(['grid', 'list'].includes(urlView) ? urlView : 'grid');

        // Inizializza sia i filtri attivi che quelli staging dai parametri URL
        setFilterPriceRange(urlPriceRange);
        setStagedFilterPriceRange(urlPriceRange);

        setFilterEditorialLine(urlEditorialLine);
        setStagedFilterEditorialLine(urlEditorialLine);

        let discountValue = null;
        if (urlHasDiscountParam === 'true') discountValue = true;
        else if (urlHasDiscountParam === 'false') discountValue = false;
        setFilterHasDiscount(discountValue);
        setStagedFilterHasDiscount(discountValue);

        setIsInitialized(true); // Segna l'inizializzazione come completata
    }, []); // Eseguire solo al mount per leggere i parametri URL iniziali

    // Funzione per recuperare i manga dal backend (memoizzata)
    const getManga = useCallback(() => {
        if (!isInitialized) return; // Non fare nulla se non ancora inizializzato

        setLoading(true);
        setError(null);

        const params = {
            search: search || undefined, // Invia undefined se la stringa è vuota per non inviare il parametro
            page: currentPage,
            limit: itemsPerPage,
            order: order || undefined,
            // Invia i parametri dei filtri ATTIVI al backend
            max_price: filterPriceRange !== DEFAULT_MAX_PRICE ? filterPriceRange : undefined,
            editorial_line: filterEditorialLine || undefined,
        };

        if (filterHasDiscount !== null) {
            params.has_discount = filterHasDiscount; // Invia true o false
        }

        axios.get(`${import.meta.env.VITE_PUBLIC_PATH}manga/`, { params })
            .then(res => {
                setManga(res.data.items);
                setTotalItems(res.data.totalItems);
            })
            .catch(err => {
                console.error("Errore nel caricamento manga:", err);
                setError("Impossibile caricare i manga. Riprova più tardi.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [
        isInitialized, search, currentPage, itemsPerPage, order,
        filterPriceRange, filterEditorialLine, filterHasDiscount, DEFAULT_MAX_PRICE // Dipendenze di getManga
    ]);

    // la ricerca, l'ordinamento o la pagina.
    useEffect(() => {
        if (!isInitialized) return;

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const newTimeout = setTimeout(() => {
            getManga();
        }, 300); // Debounce di 300ms
        setDebounceTimeout(newTimeout);

        return () => clearTimeout(newTimeout); // Cleanup del timeout
    }, [getManga]); // getManga è memoizzata e contiene tutte le dipendenze rilevanti

    // Effetto per aggiornare i parametri URL quando cambiano i filtri attivi,
    // la ricerca, l'ordinamento, la pagina o la modalità di visualizzazione.
    useEffect(() => {
        if (!isInitialized) return;

        const newParams = new URLSearchParams();

        if (order) newParams.set("order", order);
        if (search) newParams.set("search", search);
        if (currentPage !== 1) newParams.set("page", currentPage.toString());
        if (viewMode !== 'grid') newParams.set("view", viewMode);

        if (filterPriceRange !== DEFAULT_MAX_PRICE) newParams.set("priceRange", filterPriceRange.toString());
        if (filterEditorialLine) newParams.set("editorialLine", filterEditorialLine);
        if (filterHasDiscount !== null) newParams.set("hasDiscount", filterHasDiscount.toString());

        setSearchParams(newParams, { replace: true });
    }, [
        order, search, currentPage, viewMode, filterPriceRange, filterEditorialLine,
        filterHasDiscount, setSearchParams, isInitialized, DEFAULT_MAX_PRICE
    ]);

    // Gestore per l'apertura dell'offcanvas dei filtri
    const handleOpenOffcanvas = () => {
        // Sincronizza gli stati staging con gli stati attivi correnti
        setStagedFilterPriceRange(filterPriceRange);
        setStagedFilterEditorialLine(filterEditorialLine);
        setStagedFilterHasDiscount(filterHasDiscount);
        setIsOffcanvasOpen(true); // Apre l'offcanvas
    };

    // Gestore per la chiusura dell'offcanvas (memoizzata)
    const handleCloseOffcanvas = useCallback(() => {
        setIsOffcanvasOpen(false);
    }, []);



    const handleApplyStagedFilters = () => {
        // Copia i valori dagli stati staging agli stati attivi
        setFilterPriceRange(stagedFilterPriceRange);
        setFilterEditorialLine(stagedFilterEditorialLine);
        setFilterHasDiscount(stagedFilterHasDiscount);
        setItemPerPage(stagedItemsPerPage);
        setCurrentPage(1); // Resetta la pagina quando si applicano nuovi filtri
        handleCloseOffcanvas(); // Chiude l'offcanvas
        // Il cambio dei filtri attivi triggererà l'useEffect per getManga
    };


    // Gestore per resettare tutti i filtri ai valori di default
    const resetAllFilters = () => {
        setFilterPriceRange(DEFAULT_MAX_PRICE);
        setFilterEditorialLine('');
        setFilterHasDiscount(null);

        setStagedFilterPriceRange(DEFAULT_MAX_PRICE);
        setStagedFilterEditorialLine('');
        setStagedFilterHasDiscount(null);

        setCurrentPage(1); // Resetta anche la pagina
        // Il cambio dei filtri attivi triggererà l'useEffect per getManga
    };

    // Gestore per il cambio di ordinamento
    function orderManga(e) {
        setOrder(e.target.value);
        setCurrentPage(1); // Resetta la pagina quando cambia l'ordinamento
    }

    // Gestore per il cambio nell'input di ricerca
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Resetta la pagina quando inizia una nuova ricerca
    };

    // Componente per visualizzare un riepilogo dei filtri attivi
    const ActiveFiltersSummary = () => {
        const isActive = filterPriceRange !== DEFAULT_MAX_PRICE || filterEditorialLine || filterHasDiscount !== null;
        if (!isActive) return null;

        let discountText = "";
        if (filterHasDiscount === true) discountText = "In Sconto";
        else if (filterHasDiscount === false) discountText = "Non in Sconto";

        return (
            <div className="mt-3 mb-2 d-flex align-items-center flex-wrap gap-2">
                <small className="me-1">Filtri attivi:</small>
                {filterPriceRange !== DEFAULT_MAX_PRICE && (
                    <span className="badge bg-secondary">Prezzo &lt; {filterPriceRange}€</span>
                )}
                {filterEditorialLine && (
                    <span className="badge bg-secondary">{filterEditorialLine}</span>
                )}
                {discountText && (
                    <span className="badge bg-secondary">{discountText}</span>
                )}
                <button className="btn btn-sm btn-link text-danger p-0" onClick={resetAllFilters} aria-label="Resetta filtri">
                    Resetta tutti
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="container my-5">
                {/* Sezione Intestazione e Controlli */}
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap gap-3">
                    <h1>Lista di Manga</h1>
                    <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                        {/* Controlli View Mode */}
                        <div className="btn-group btn-group-sm" role="group" aria-label="Modalità visualizzazione">
                            <button
                                type="button"
                                className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setViewMode("grid")}
                                title="Griglia"
                            >
                                <i className="fas fa-th"></i>
                            </button>
                            <button
                                type="button"
                                className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setViewMode("list")}
                                title="Lista"
                            >
                                <i className="fas fa-list"></i>
                            </button>
                        </div>

                        {/* Ordinamento */}
                        <div>
                            <select
                                className="form-select form-select-sm"
                                aria-label="Ordina per"
                                onChange={orderManga}
                                value={order}
                            >
                                <option value="">Ordina per...</option>
                                <option value="order_price ASC">Prezzo crescente</option>
                                <option value="order_price DESC">Prezzo decrescente</option>
                                <option value="manga.title ASC">Nome (A-Z)</option>
                                <option value="manga.title DESC">Nome (Z-A)</option>
                                <option value="manga.release_date DESC">Più recente</option>
                                <option value="manga.release_date ASC">Meno recente</option>
                            </select>
                        </div>

                        {/* Pulsante Filtri */}
                        <button
                            className="btn btn-sm btn-outline-primary"
                            type="button"
                            onClick={handleOpenOffcanvas}
                        >
                            <i className="fas fa-filter me-1"></i>Filtra
                        </button>

                        {/* Input Ricerca */}
                        <form className="d-flex" onSubmit={(e) => e.preventDefault()} role="search">
                            <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder="Cerca manga..."
                                aria-label="Cerca manga"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </form>
                    </div>
                </div>

                <ActiveFiltersSummary />

                {/* Sezione Risultati Manga */}
                {loading && (
                    <div className="text-center mt-5">
                        <p>Caricamento manga...</p>
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                {error && !loading && (
                    <div className="alert alert-danger mt-4" role="alert">
                        {error}
                    </div>
                )}
                {!loading && !error && manga.length === 0 && isInitialized && (
                    <div className="text-center mt-5">
                        <p>Nessun manga trovato. Prova a modificare la ricerca o i filtri applicati.</p>
                    </div>
                )}
                {!loading && !error && manga.length > 0 && (
                    viewMode === "grid" ? (
                        <div className="row mt-4">
                            {manga.map(mangaItem => (
                                mangaItem && mangaItem.id ? (
                                    <div key={mangaItem.id} className="col-12 col-sm-6 col-md-4 col-lg-4 col-xxl-3 mb-3">
                                        <MangaCard data={mangaItem} />
                                    </div>
                                ) : null
                            ))}
                        </div>
                    ) : (
                        <div className="list-group mt-4">
                            {manga.map(mangaItem => (
                                mangaItem && mangaItem.id ? (
                                    <MangaListCard key={mangaItem.id} data={mangaItem} viewMode={viewMode} />
                                ) : null
                            ))}
                        </div>
                    )
                )}

                {/* Controlli di paginazione */}
                {totalItems > 0 && totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-5 mb-4 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(pageNum =>
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                            )
                            .map((pageNum, idx, arr) => {
                                const prevPage = arr[idx - 1];
                                return (
                                    <span key={pageNum}>
                                        {prevPage && pageNum - prevPage > 1 && (
                                            <span className="mx-1">...</span>
                                        )}
                                        <button
                                            className={`btn mx-1 ${currentPage === pageNum ? "btn-primary" : "btn-outline-primary"}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                            disabled={currentPage === pageNum}
                                        >
                                            {pageNum}
                                        </button>
                                    </span>
                                );
                            })}
                    </div>
                )}
            </div>

            {/* Componente Offcanvas per i Filtri */}
            <Filter
                isOpen={isOffcanvasOpen}
                onClose={handleCloseOffcanvas} // Passa la funzione di chiusura memoizzata
                onApplyFilters={handleApplyStagedFilters} // Funzione per applicare i filtri staging
                // Passa gli stati STAGING e i loro setter al componente Filter
                stagedPriceRange={stagedFilterPriceRange}
                setStagedPriceRange={setStagedFilterPriceRange}
                stagedEditorialLine={stagedFilterEditorialLine}
                setStagedEditorialLine={setStagedFilterEditorialLine}
                stagedHasDiscount={stagedFilterHasDiscount}
                setStagedHasDiscount={setStagedFilterHasDiscount}
                defaultMaxPrice={DEFAULT_MAX_PRICE} // Passa il valore di default per il prezzo massimo

                stagedItemsPerPage={stagedItemsPerPage}
                setStagedItemsPerPage={setStagedItemsPerPage}
                defaultItemsPerPage={itemsPerPage}
            />
        </>
    );
}

export default MangaPage;