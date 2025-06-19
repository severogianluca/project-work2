import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import notFoundIllustration from '../public/sad_luffy.png'
const NotFoundPage = () => {
    useEffect(() => {
        document.title = 'Pagina Non Trovata (404)';
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container text-center pb-5 my-auto">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8 col-xl-7">
                    <img
                        src={notFoundIllustration}
                        alt="Illustrazione Pagina Non Trovata"
                        className="img-fluid w-75"
                        style={{ maxWidth: '350px' }}
                    />

                    <h1 className="display-1 fw-bolder text-primary mb-3">404</h1>
                    <h2 className="h1 mb-3 fw-semibold">Oops! Pagina non trovata.</h2>
                    <p className="lead text-muted mb-4 px-md-3">
                        La pagina che stai cercando potrebbe essere stata rimossa, rinominata,
                        o forse non è mai esistita.
                    </p>
                    <p className="text-muted mb-4 px-md-3">
                        Non preoccuparti, succede! Puoi tornare alla nostra homepage o provare a cercare di nuovo.
                    </p>
                    <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mb-5">
                        <Link to="/" className="btn btn-primary btn-lg px-4 py-2 me-sm-3 fw-semibold">
                            <i className="fas fa-home me-2"></i>
                            Torna alla Homepage
                        </Link>
                        <Link to="/contacts" className="btn btn-outline-secondary btn-lg px-4 py-2 fw-semibold">
                            Contattaci
                        </Link>
                    </div>
                    <p className="text-muted small">
                        Se credi che questo sia un errore o se hai seguito un link dal nostro sito,
                        ti saremmo grati se potessi <Link to="/contacts" className="text-decoration-none">segnalarcelo</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;