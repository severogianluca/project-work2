import { Link } from "react-router-dom";
import DiscountBedge from "./DiscountBedge";
import HeartIcon from "./HeartIcon";
import AddToCartButton from "./AddToCartButton";


function MangaCard({ data }) {
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
    const discountPercentualeNumerico = Number(data.discount);
    const discount = discountPercentualeNumerico / 100;
    const prezzoScontatoNumerico = prezzoBaseNumerico * (1 - discount);
    const prezzoScontatoFormattato = prezzoScontatoNumerico.toFixed(2).replace(".", ",");


    return (
        <div className="card shadow-sm h-100 manga-card">
            <button
                className="heart-button"
                aria-label="Aggiungi alla wishlist"
            >
                <HeartIcon manga={data} />
            </button>

            <Link to={`/manga/${data.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div>
                    <img
                        className="card-img-top mx-auto d-block mt-3 manga-image"
                        src={data.imagePath}
                        alt={data.title}
                    />
                </div>
            </Link>
            <div className="card-body d-flex flex-column justify-content-between">
                <Link to={`/manga/${data.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="text-center">
                        <p>
                            <strong>{data.title}</strong>
                        </p>
                    </div>
                </Link>
                <div className="mt-1 d-flex flex-column">
                    <div className="text-center">
                        {discountPercentualeNumerico > 0 ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span className="text-decoration-line-through text-muted">
                                        <strong>{`${prezzoNuovo}€`}</strong>
                                    </span>
                                    <span className="text-danger">
                                        <strong>{`${prezzoScontatoFormattato}€`}</strong>
                                    </span>
                                    <DiscountBedge discount={discountPercentualeNumerico} />
                                </div>
                            </>
                        ) : (
                            <span>
                                <strong>{`${prezzoNuovo}€`} </strong>
                            </span>
                        )}
                        <div>
                            <p>
                                <strong>Genere:</strong> {`${data.genre}`}
                            </p>
                        </div>
                    </div>


                    <AddToCartButton manga={data} />

                </div>
            </div>
        </div>
    );
}

export default MangaCard;