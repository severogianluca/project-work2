import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeartIcon from "../components/HeartIcon";
import AddToCartButton from "../components/AddToCartButton";

function MangaDetailsPage() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { slug } = useParams();

    const [manga, setManga] = useState(null)

    function getManga() {
        axios.get(import.meta.env.VITE_PUBLIC_PATH + `manga/${slug}`)
            .then(res => {
                setManga(res.data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getManga()
    }, [slug])

    if (!manga) {
        return <div>Caricamento...</div>;
    }

    const prezzo = String(manga.price);
    let decimale = prezzo.slice(prezzo.indexOf(".") + 1);

    if (prezzo.indexOf(".") === -1) {
        decimale = "00";
    } else if (prezzo.slice(prezzo.indexOf(".") + 1).length === 1) {
        decimale = prezzo.slice(prezzo.indexOf(".") + 1) + "0";
    } else if (prezzo.slice(prezzo.indexOf(".") + 1).length === 0) {
        decimale = "00";
    } else if (prezzo.slice(prezzo.indexOf(".") + 1).length === 2) {
        decimale = prezzo.slice(prezzo.indexOf(".") + 1);
    }

    const prezzoNuovo = (prezzo.indexOf(".") !== -1 ? prezzo.slice(0, prezzo.indexOf(".")) : prezzo) + "," + decimale;

    const discountPercentualeNumerico = Number(manga.discount);
    const discount = discountPercentualeNumerico / 100;
    const prezzoScontatoNumerico = parseFloat(manga.price) * (1 - discount);
    const prezzoScontatoFormattato = prezzoScontatoNumerico.toFixed(2).replace(".", ",");

    function formatItalianDate(dateString) {
        if (!dateString) {
            return 'N/D';
        }

        try {
            const dateObj = new Date(dateString);

            if (isNaN(dateObj.getTime())) {
                return 'Data non valida';
            }

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error("Errore durante la formattazione della data:", dateString, error);
            return 'Errore data';
        }
    }

    return (
        <>
            <div className="container pb-5 pt-5">
                <div className="row">
                    <div className="col-md-6 px-5 mb-4">
                        <img src={manga.imagePath} className="img-fluid rounded shadow" alt={manga.title} />
                    </div>

                    <div className="col-md-6">
                        <h1 className="mb-2">{manga.title}</h1>
                        <h5 className="text-muted">Serie: {manga.serie}</h5>

                        <div className="d-flex align-items-center mt-4">
                            <AddToCartButton btnLg={true} manga={manga} />
                            <HeartIcon manga={manga} customStyle={{ fontSize: '2.5rem' }} />
                        </div>

                        <p className="mt-4">
                            {manga.description}
                        </p>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <ul className="list-unstyled">
                                    <li>Autore: <strong>{manga.author}</strong></li>
                                    <li className="mt-1" >{Number(manga.discount) > 0 ? (
                                        <>
                                            <span>Prezzo: </span>
                                            <span className="text-decoration-line-through text-muted me-2">
                                                <strong>{` ${prezzoNuovo}€`}</strong>
                                            </span>
                                            <span className="text-danger">
                                                <strong>{` ${prezzoScontatoFormattato}€`}</strong>
                                            </span>
                                        </>
                                    ) : (
                                        <span>
                                            Prezzo: <strong>{` ${prezzoNuovo}€`}</strong>
                                        </span>
                                    )} </li>
                                    <li className="mt-1">ISBN: <strong>{manga.ISBN}</strong></li>
                                    <li className="mt-1">Numero di pagine: <strong>{manga.pages}</strong></li>
                                    <li className="mt-1">Data uscita: <strong>{formatItalianDate(manga.release_date)}</strong></li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Genere:</strong></p>
                                <div>
                                    {manga.genres_array &&
                                        manga.genres_array.map((genre) => (
                                            <span key={genre} className="badge bg-primary me-1">
                                                {genre}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MangaDetailsPage;