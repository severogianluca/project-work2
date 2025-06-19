import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const Filter = ({
    isOpen,
    onClose,
    onApplyFilters,
    stagedPriceRange,
    setStagedPriceRange,
    stagedEditorialLine,
    setStagedEditorialLine,
    stagedHasDiscount,
    setStagedHasDiscount,
    defaultMaxPrice,
    // MODIFICATO: Nuove prop per il filtro elementi per pagina
    stagedItemsPerPage,
    setStagedItemsPerPage,
    defaultItemsPerPage
}) => {
    const offcanvasHtmlRef = useRef(null);
    const bsOffcanvasInstanceRef = useRef(null);

    const [availableGenres, setAvailableGenres] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_PUBLIC_PATH}manga/genre`)
            .then(res => {
                if (res.status === 200) {
                    setAvailableGenres(res.data);
                    setError(null);
                } else {
                    setError("Errore nel caricamento dei generi.");
                }
            })
            .catch(err => {
                console.error("Errore nel caricamento dei generi:", err);
                setError("Impossibile caricare i generi. Riprova più tardi.");
            });
    }, []);


    // Effetto 1: Inizializza l'istanza di Bootstrap Offcanvas al mount del componente
    useEffect(() => {
        if (offcanvasHtmlRef.current && window.bootstrap?.Offcanvas) {
            if (!bsOffcanvasInstanceRef.current) {
                bsOffcanvasInstanceRef.current = new window.bootstrap.Offcanvas(offcanvasHtmlRef.current);
            }
        } else if (offcanvasHtmlRef.current && !window.bootstrap?.Offcanvas) {
            console.warn(
                "Filter: Bootstrap (o bootstrap.Offcanvas) non trovato sull'oggetto 'window'. " +
                "Assicurati che lo script JS di Bootstrap dalla CDN sia caricato correttamente."
            );
        }
    }, []);

    // Effetto 2: Sincronizza lo stato React 'isOpen' con Bootstrap quando l'offcanvas
    useEffect(() => {
        const htmlElement = offcanvasHtmlRef.current;
        const offcanvasJsInstance = bsOffcanvasInstanceRef.current;

        if (htmlElement && offcanvasJsInstance) {
            const handleExternalClose = () => {
                onClose();
            };

            htmlElement.addEventListener('hidden.bs.offcanvas', handleExternalClose);

            return () => {
                htmlElement.removeEventListener('hidden.bs.offcanvas', handleExternalClose);
            };
        }
    }, [onClose]);

    // Effetto 3: Mostra o nasconde programmaticamente l'offcanvas
    // in base alla prop 'isOpen'
    useEffect(() => {
        const offcanvasJsInstance = bsOffcanvasInstanceRef.current;
        if (offcanvasJsInstance) {
            if (isOpen) {
                offcanvasJsInstance.show();
            } else {
                offcanvasJsInstance.hide();
            }
        }
    }, [isOpen]);

    // Funzione per resettare un singolo filtro (nello stato staging)
    const handleResetIndividualFilter = (setterFunction, defaultValue) => {
        setterFunction(defaultValue);
    };

    // Funzione per sottomettere i filtri (chiama la callback da MangaPage)
    const handleSubmitFilters = () => {
        onApplyFilters();
    };

    return (
        <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="filterOffcanvas"
            aria-labelledby="filterOffcanvasLabel"
            ref={offcanvasHtmlRef}
        >
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="filterOffcanvasLabel">Filtri</h5>
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                ></button>
            </div>
            <div className="offcanvas-body">
                {/* Filtro per il Prezzo (Range) */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <label htmlFor="priceRangeFilterInput" className="form-label">
                            Prezzo Max: {typeof stagedPriceRange === 'number' ? stagedPriceRange.toFixed(2) : parseFloat(stagedPriceRange || defaultMaxPrice).toFixed(2)}€
                        </label>
                        {/* Mostra il pulsante di reset solo se il valore non è quello di default */}
                        {(typeof stagedPriceRange === 'number' && stagedPriceRange !== defaultMaxPrice) && (
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none p-0"
                                onClick={() => handleResetIndividualFilter(setStagedPriceRange, defaultMaxPrice)}
                                title="Resetta prezzo"
                                style={{ lineHeight: 1 }}
                            > x </button>
                        )}
                    </div>
                    <input
                        type="range"
                        className="form-range"
                        id="priceRangeFilterInput"
                        min="0.00"
                        max={typeof defaultMaxPrice === 'number' ? defaultMaxPrice.toFixed(2) : "50.00"}
                        step="0.50"
                        value={typeof stagedPriceRange === 'number' ? stagedPriceRange : defaultMaxPrice}
                        onChange={(e) => setStagedPriceRange(parseFloat(e.target.value))}
                    />
                </div>

                {/* Filtro per Genere/Linea Editoriale (Select) */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <label htmlFor="editorialLineFilterSelect" className="form-label d-block">Genere:</label>
                        {stagedEditorialLine && (
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none p-0"
                                onClick={() => handleResetIndividualFilter(setStagedEditorialLine, '')}
                                title="Resetta genere"
                                style={{ lineHeight: 1 }}
                            > x </button>
                        )}
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <select
                        className="form-select"
                        id="editorialLineFilterSelect"
                        value={stagedEditorialLine}
                        onChange={(e) => setStagedEditorialLine(e.target.value)}
                    >
                        <option value="">Tutti i generi</option>
                        {availableGenres.map((genreOption, index) => (
                            <option key={index} value={genreOption}>
                                {genreOption}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro per Sconto (Select) */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <label htmlFor="discountStatusFilterSelect" className="form-label d-block">Stato Sconto:</label>
                        {stagedHasDiscount !== null && (
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none p-0"
                                onClick={() => handleResetIndividualFilter(setStagedHasDiscount, null)}
                                title="Resetta stato sconto"
                                style={{ lineHeight: 1 }}
                            > x </button>
                        )}
                    </div>
                    <select
                        className="form-select"
                        id="discountStatusFilterSelect"
                        value={stagedHasDiscount === null ? "any" : (stagedHasDiscount ? "yes" : "no")}
                        onChange={(e) => {
                            if (e.target.value === "yes") setStagedHasDiscount(true);
                            else if (e.target.value === "no") setStagedHasDiscount(false);
                            else setStagedHasDiscount(null); // "any"
                        }}
                    >
                        <option value="any">Qualsiasi</option>
                        <option value="yes">In Sconto</option>
                        <option value="no">Non in Sconto</option>
                    </select>
                </div>


                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <label htmlFor="itemsPerPageFilterSelect" className="form-label d-block">Manga per Pagina:</label>
                        {stagedItemsPerPage !== defaultItemsPerPage && (
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none p-0"
                                onClick={() => handleResetIndividualFilter(setStagedItemsPerPage, defaultItemsPerPage)}
                                title="Resetta elementi per pagina"
                                style={{ lineHeight: 1 }}
                            > x </button>
                        )}
                    </div>
                    <select
                        className="form-select"
                        id="itemsPerPageFilterSelect"
                        value={stagedItemsPerPage}
                        onChange={(e) => setStagedItemsPerPage(parseInt(e.target.value))}
                    >
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                    </select>
                </div>


                {/* Pulsante per Applicare i Filtri */}
                <div className="d-grid mt-4">
                    <button type="button" className="btn btn-primary" onClick={handleSubmitFilters}>
                        Applica Filtri
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Filter;