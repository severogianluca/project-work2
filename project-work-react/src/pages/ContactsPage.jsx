import { useEffect } from "react";
const ContactsPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return <>
        <div className="container py-5 page-content">
            <h2 className="mb-4">📬 Contattaci</h2>
            <p className="mb-4">
                Per qualsiasi informazione riguardante ordini, spedizioni, disponibilità dei prodotti o collaborazioni, puoi contattarci attraverso i seguenti canali. Il nostro team sarà lieto di rispondere nel più breve tempo possibile durante gli orari lavorativi.
            </p>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <h5><i className="fas fa-map-marker-alt text-danger me-2"></i> Sede</h5>
                    <p>Via Luca Signorelli, 12, 00196 Roma (RM)</p>

                    <h5><i className="fas fa-envelope text-warning me-2"></i> Email</h5>
                    <p><a href="mailto:support@mangaverse.com">ecommerce.manga@gmail.com</a></p>

                    <h5><i className="fas fa-phone text-success me-2"></i> Telefono</h5>
                    <p>+39 123 456 7890</p>
                </div>

                <div className="col-md-6 mb-4">
                    <h5><i className="fas fa-clock text-primary me-2"></i> Orari di apertura</h5>
                    <ul className="list-unstyled">
                        <li><strong>Lunedì - Venerdì:</strong> 9:00 - 18:00</li>
                        <li><strong>Sabato:</strong> 10:00 - 14:00</li>
                        <li><strong>Domenica:</strong> Chiuso </li>
                    </ul>

                    <h5><i className="fab fa-instagram text-pink me-2"></i> Social</h5>
                    <p>
                        <a href="#" className="text-decoration-none">@manga_ecommerce</a><br />
                        <a href="#" className="text-decoration-none"><i className="fab fa-twitter me-1"></i>@manga_ecommerce</a>
                    </p>
                </div>
            </div>

            <div className="text-muted mt-4">
                <small><i className="fas fa-info-circle me-1"></i> Rispondiamo entro 24h nei giorni lavorativi. Nei periodi di maggire affluenza il periodo di risposta può variare di 24-48h.</small>
            </div>
        </div>
    </>
};

export default ContactsPage;