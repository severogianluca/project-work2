import MangaCard from '../components/MangaCard';
import MangaListCard from '../components/MangaListCard';
import { useEffect, useState } from 'react';
import PaginationControls from '../components/PaginationControls';
import { useWishlist } from '../contexts/WishListContext';

function Wishlist() {
    const { wishlist } = useWishlist();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [viewMode, setViewMode] = useState("grid");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    useEffect(() => {
        const newTotalPages = Math.ceil(wishlist.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(1);
        } else if (wishlist.length === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }

    }, [wishlist, itemsPerPage, currentPage, viewMode]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentManga = wishlist.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(wishlist.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">La mia Wishlist</h1>

            <div className="d-flex align-items-center gap-2 mb-4">
                <button
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setViewMode("grid")}
                    title="Griglia"
                >
                    <i className="fas fa-th"></i>
                </button>
                <button
                    className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setViewMode("list")}
                    title="Lista"
                >
                    <i className="fas fa-list"></i>
                </button>
            </div>

            {wishlist && wishlist.length > 0 ? (
                <>
                    {viewMode === "grid" ? (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {currentManga.map(manga => (
                                <div key={manga.slug} className="col-6 col-sm-6 col-md-4 col-lg-4 col-xxl-3 mb-3">
                                    <MangaCard data={manga} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="list-group mt-4">
                            {currentManga.map(manga => (
                                <div key={manga.slug} className="list-group-item">
                                    <MangaListCard data={manga} />
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-5">
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="alert alert-info text-center" role="alert">
                    La tua wishlist è vuota. Aggiungi i tuoi manga preferiti!
                </div>
            )}
        </div>
    );
}

export default Wishlist;