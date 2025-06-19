import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MangaCard from "../components/MangaCard";
import MangaListCard from "../components/MangaListCard";
import PaginationControls from "../components/PaginationControls";


function SerieDetailsPage() {
    const { slug } = useParams();
    const [serie, setSerie] = useState(null);
    const [allVolumi, setAllVolumi] = useState([]);
    const [displayVolumi, setDisplayVolumi] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [isInitialized, setIsInitialized] = useState(false);
    const [viewMode, setViewMode] = useState("grid");


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);



    useEffect(() => {
        axios.get(import.meta.env.VITE_PUBLIC_PATH + `manga/series/${slug}`)
            .then(res => {
                setSerie(res.data.series);
                setAllVolumi(res.data.manga);
            })
            .catch(err => console.error(err));
    }, [slug]);


    useEffect(() => {
        const urlView = searchParams.get('view') || 'grid';
        const urlPage = parseInt(searchParams.get('page')) || 1;

        if (['grid', 'list'].includes(urlView)) {
            setViewMode(urlView);
        } else {
            setViewMode('grid');
        }
        setCurrentPage(Math.max(1, urlPage));
        setIsInitialized(true);
    }, []);


    useEffect(() => {
        if (!isInitialized) return;
        const newParams = new URLSearchParams();

        if (viewMode && viewMode !== 'grid') {
            newParams.set("view", viewMode);
        }
        if (currentPage !== 1) {
            newParams.set("page", currentPage.toString());
        }

        setSearchParams(newParams, { replace: true });
    }, [viewMode, currentPage, isInitialized, setSearchParams]);


    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = allVolumi.slice(indexOfFirstItem, indexOfLastItem);
        setDisplayVolumi(currentItems);

        if (allVolumi.length > 0 && currentPage > Math.ceil(allVolumi.length / itemsPerPage)) {
            setCurrentPage(1);
        } else if (allVolumi.length === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }

        window.scrollTo(0, 0);

    }, [allVolumi, currentPage, itemsPerPage]);


    const totalPages = Math.ceil(allVolumi.length / itemsPerPage);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (!serie) {
        return <p>Caricamento...</p>;
    }

    return (
        <div className="container mt-2">
            <div className="position-relative">
                <img
                    className="card-img-top rounded-top-4"
                    src={import.meta.env.VITE_PUBLIC_PATH + serie.image_series}
                    alt={serie.name}
                    style={{
                        height: "400px",
                        objectFit: "cover",
                        objectPosition: "top",
                    }}
                />
                <div className="fade-bottom" />
            </div>
            <div>
                <h1 className="mb-4" style={{ fontSize: "3rem" }}>{serie.name}</h1>
                <div className="d-flex gap-3">
                    <h4>Volumi: <strong>{serie.number_volumes}</strong></h4>
                    <h4>Autore: <strong>{serie.author}</strong></h4>
                </div>
                <div className="mt-2 mb-5">
                    <h5> {serie.description} </h5>
                </div>
            </div>

            {/* bottoni per paginazione griglia o lista */}
            <div className="d-flex align-items-center gap-2 mb-4">
                <button
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setViewMode("grid")}
                    title="griglia"
                >
                    <i className="fas fa-th"></i>
                </button>
                <button
                    className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setViewMode("list")}
                    title="lista"
                >
                    <i className="fas fa-list"></i>
                </button>
            </div>

            {/* visualizzazione manga */}
            <div className="row mb-5">
                {displayVolumi.length > 0 ? (
                    viewMode === "grid" ? (
                        <div className="row mt-4">
                            {displayVolumi.map(volumiItem => (
                                <div key={volumiItem.id} className="col-12 col-md-4 col-lg-3 mt-3">
                                    <MangaCard data={volumiItem} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="list-group mt-4">
                            {displayVolumi.map(volumiItem => (
                                <div key={volumiItem.id} className="list-group-item">
                                    <MangaListCard data={volumiItem} />
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <p className="text-center mt-5">Nessun volume trovato per questa serie.</p>
                )}
            </div>

            {totalPages > 1 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

export default SerieDetailsPage;