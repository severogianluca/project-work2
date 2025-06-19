import { useEffect } from "react";
const AboutPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container py-5 page-content">
            <h2 className="mb-4">📖 Chi siamo</h2>
            <p>
                Benvenuto/a su <strong>Manga e-commerce</strong>, il tuo portale definitivo per esplorare l’universo dei manga! 💥
                Siamo un team di appassionati, sviluppatori e collezionisti che hanno deciso di unire le forze per portare il meglio del manga direttamente a casa tua.
            </p>
            <p>
                Dal classico shonen all'horror psicologico più oscuro, curiamo ogni collezione con amore e attenzione. Collaboriamo con editori ufficiali e offriamo sia edizioni nuove che pezzi da collezione introvabili.
            </p>
            <p>
                La nostra missione? 📦 Consegnare emozioni, avventure e storie incredibili... un volume alla volta.
            </p>

            <div className="row mt-4">
                <div className="col-md-4">
                    <i className="fas fa-globe fa-2x mb-2 text-primary"></i>
                    <h5>Internazionali</h5>
                    <p>Spediamo in tutta Europa con cura e puntualità.</p>
                </div>
                <div className="col-md-4">
                    <i className="fas fa-heart fa-2x mb-2 text-danger"></i>
                    <h5>100% passione</h5>
                    <p>Tutti i nostri prodotti sono scelti da veri appassionati.</p>
                </div>
                <div className="col-md-4">
                    <i className="fas fa-shield-alt fa-2x mb-2 text-success"></i>
                    <h5>Sicurezza garantita</h5>
                    <p>Pagamenti sicuri, resi semplici e nessun rischio.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;