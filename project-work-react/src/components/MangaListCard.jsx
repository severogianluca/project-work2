import { Link } from "react-router-dom";
import DiscountBedge from "./DiscountBedge";
import HeartIcon from "./HeartIcon";
import AddToCartButton from "./AddToCartButton";

function MangaListCard({ data, viewMode }) {

    const prezzo = String(data.price);
    let decimale = prezzo.slice(prezzo.indexOf(".") + 1);

    if (prezzo.slice(prezzo.indexOf(".") + 1).length === 1) {
        decimale = prezzo.slice(prezzo.indexOf(".") + 1) + "0";
    } else if (prezzo.slice(prezzo.indexOf(".") + 1).length === 0) {
        decimale = "00";
    } else if (prezzo.slice(prezzo.indexOf(".") + 1).length === 2) {
        decimale = prezzo.slice(prezzo.indexOf(".") + 1);
    }

    const prezzoNuovo = prezzo.slice(0, prezzo.indexOf(".")) + "," + decimale;

    // CALCOLO DELLO SCONTO
    const prezzoBaseNumerico = parseFloat(data.price);
    // controllo che sia numero
    const discountPercentualeNumerico = Number(data.discount);
    const discount = discountPercentualeNumerico / 100;
    const prezzoScontatoNumerico = prezzoBaseNumerico * (1 - discount);
    const prezzoScontatoFormattato = prezzoScontatoNumerico.toFixed(2).replace(".", ",");

    return (
        <div className="card shadow-sm h-100 flex-row align-items-center p-2" style={{ position: 'relative' }}>
            <Link to={`/manga/${data.slug}`}>
                <img
                    className="rounded"
                    src={data.imagePath}
                    alt={data.title}
                    style={{ height: "120px", width: "80px", objectFit: "cover" }}
                />
            </Link>
            <div className="card-body d-flex flex-column justify-content-between ms-3 p-2">
                <div>
                    <div className="d-flex justify-content-between">
                        <h5 className="mb-1">
                            <Link to={`/manga/${data.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                                {data.title}
                            </Link>
                        </h5>

                        <button
                            className="heart-button"
                            aria-label="Aggiungi alla wishlist"
                            style={{
                                borderRadius: '50%',
                                border: 'none',
                                background: 'none',
                                fontSize: 'x-large',
                            }}
                        >
                            <HeartIcon manga={data} />
                        </button>
                    </div>

                    <div className="d-flex align-items-center flex-wrap">
                        {Number(data.discount) > 0 ? (
                            <>
                                <span className="text-decoration-line-through text-muted me-2">
                                    <strong>{`${prezzoNuovo}€`}</strong>
                                </span>
                                <span className="text-danger me-2">
                                    <strong>{`${prezzoScontatoFormattato}€`}</strong>
                                </span>
                                <DiscountBedge discount={discountPercentualeNumerico} />
                            </>
                        ) : (
                            <span>
                                <strong>{`${prezzoNuovo}€`}</strong>
                            </span>
                        )}
                    </div>
                    <div className="text-muted small mt-1">
                        <strong>Genere:</strong> {data.genre}
                    </div>
                </div>

                <div className="ms-auto text-end">
                    <AddToCartButton manga={data} viewMode={viewMode} />
                </div>
            </div>
        </div>
    );
}

export default MangaListCard;