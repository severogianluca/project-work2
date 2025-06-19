import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

function OrderSummaryPage() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { state } = useLocation();

    const {
        formData = {},
        cartItems = [],
        cartTotal = 0,
        shippingCost = 0,
        finalOrderTotal = 0,
        estimatedShippingDate,
        payment_method = '',
        promo_code,
        promoDiscountPercent = 0,
        discountAmount = 0
    } = state || {};

    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            const numPrice = parseFloat(price);
            if (isNaN(numPrice)) return 'N/A';
            return '€ ' + numPrice.toFixed(2).replace('.', ',');
        }
        return '€ ' + price.toFixed(2).replace('.', ',');
    };

    const estimatedShippingDateFormatted = estimatedShippingDate ?
        new Date(estimatedShippingDate).toLocaleDateString("it-IT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }) : 'Non disponibile';

    function PaymentDetails({ method, name, surname, email }) {
        if (!method) return null;
        const paymentMethodLower = method.toLowerCase();

        if (paymentMethodLower === 'carta') {
            const numberCard = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
            const currentYearLastTwoDigits = new Date().getFullYear() % 100;
            const randomFutureYear = currentYearLastTwoDigits + Math.floor(Math.random() * 5) + 1;
            const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
            const expiringDate = `${randomMonth}/${randomFutureYear}`;

            return (
                <>
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <strong>Intestatario:</strong><br />
                            {name} {surname}
                        </div>
                        <div className="col-md-6 mb-2">
                            <strong>Carta:</strong><br />
                            {`**** **** **** ${numberCard}`}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <strong>Data di scadenza:</strong><br />
                            {expiringDate}
                        </div>
                        <div className="col-md-6 mb-2">
                            <strong>CVV:</strong><br />
                            {`***`}
                        </div>
                    </div>
                </>
            );
        } else if (paymentMethodLower === 'paypal') {
            return (
                <p><strong>Email PayPal: </strong>{email}</p>
            );
        }
        return <p>Dettagli per questo metodo di pagamento non disponibili.</p>;
    }
    console.log(promoDiscountPercent, discountAmount)

    return (
        <div className="container-fluid gradient-bg py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-xl-8">

                        <div className="text-center pt-2 pb-4">
                            <h1 className="display-5 fw-bold text-success">Grazie per il tuo ordine!</h1>
                            <p className="lead text-muted">Il tuo acquisto è stato confermato e verrà elaborato a breve.</p>

                            {/* INIZIO MESSAGGIO EMAIL DI CONFERMA */}
                            <div className="alert alert-warning mt-4" role="alert">
                                <h5 className="alert-heading mb-2">✉️ Email di Conferma in Arrivo!</h5>
                                <p className="mb-1">
                                    A breve riceverai un'email con il riepilogo del tuo ordine all'indirizzo: <strong>{formData.email || 'non specificato'}</strong>.
                                </p>
                                <p className="mb-0">
                                    Se non la trovi entro qualche ora, controlla la cartella SPAM/Posta Indesiderata.
                                    Se ancora non dovessi visualizzarla, non esitare a <Link to="/contacts" className="alert-link fw-semibold">contattare la nostra assistenza clienti</Link>.
                                </p>
                            </div>
                            {/* FINE MESSAGGIO EMAIL DI CONFERMA */}

                            <div className="mt-4 pt-2">
                                <Link to="/" className="btn btn-primary btn-lg px-4 px-md-5 py-2 py-md-3 shadow-sm">
                                    Torna alla Home
                                </Link>
                            </div>
                        </div>
                        <div className="bg-light shadow-sm rounded p-3 p-md-4">
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">
                                        Dettagli Spedizione e Contatto
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6><strong>Destinatario:</strong></h6>
                                            <p className="ps-2 mb-1">{formData.name} {formData.surname}</p>
                                            <p className="ps-2 mb-3">{formData.email}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <h6><strong>Indirizzo di Consegna:</strong></h6>
                                            <p className="ps-2 mb-1">{formData.address}{formData.address2 ? `, ${formData.address2}` : ''}</p>
                                            <p className="ps-2 mb-1">{formData.city}{formData.state ? `, ${formData.state}` : ''}{formData.zip ? ` - ${formData.zip}` : ''}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white py-3">
                                    <p className="mb-0">
                                        <strong>Consegna stimata:</strong> {estimatedShippingDateFormatted}
                                    </p>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">
                                        Riepilogo Ordine
                                    </h5>
                                </div>
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center px-3 px-md-4 py-2">
                                            <span>Subtotale Prodotti</span>
                                            <span>{formatPrice(cartTotal)}</span>
                                        </li>
                                        {promoDiscountPercent > 0 && (
                                            <li className="list-group-item d-flex justify-content-between align-items-center px-3 px-md-4 py-2 text-success">
                                                <span>Sconto promo ({promoDiscountPercent}%)</span>
                                                <span>-{formatPrice(discountAmount)}</span>
                                            </li>
                                        )}
                                        <li className="list-group-item d-flex justify-content-between align-items-center px-3 px-md-4 py-2">
                                            <span>Costo Spedizione</span>
                                            <span>{shippingCost === 0 ? 'Gratuita' : formatPrice(shippingCost)}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-footer bg-white fw-bold h5 d-flex justify-content-between align-items-center px-3 px-md-4 py-3">
                                    <span>Totale Finale</span>
                                    <span>{formatPrice(finalOrderTotal)}</span>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0">
                                        Dettagli Pagamento
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <p className="mb-3"><strong>Metodo: </strong>
                                        {payment_method ? payment_method.charAt(0).toUpperCase() + payment_method.slice(1).toLowerCase() : 'Non specificato'}
                                    </p>
                                    <PaymentDetails method={payment_method} name={formData.name} surname={formData.surname} email={formData.email} />
                                </div>
                            </div>
                            {cartItems && cartItems.length > 0 && (
                                <div className="card mb-4">
                                    <div className="card-header bg-white py-3">
                                        <h5 className="mb-0">
                                            Prodotti Acquistati ({cartItems.length})
                                        </h5>
                                    </div>
                                    <div className="card-body p-0">
                                        <ul className="list-group list-group-flush" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                            {cartItems.map(item => (
                                                <li key={item.slug} className="list-group-item d-flex align-items-center py-3 px-3 px-md-4">
                                                    {item.imagePath && (
                                                        <img
                                                            src={item.imagePath}
                                                            alt={item.title}
                                                            style={{
                                                                width: '100px',
                                                                height: '150px',
                                                                objectFit: 'contain',
                                                                marginRight: '20px',
                                                                borderRadius: '4px',
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                    )}
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1 fw-semibold">{item.title}</h6>
                                                        <small className="d-block text-muted">Prezzo unitario: {formatPrice(item.effective_price)}</small>
                                                        <small className="d-block text-muted">Quantità: {item.quantity}</small>
                                                    </div>
                                                    <div className="text-end ps-2" style={{ minWidth: '100px' }}>
                                                        <span className="fw-bold">
                                                            {formatPrice(item.effective_price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            <div className="alert alert-info text-center mt-4" role="alert">
                                Hai domande o problemi con il tuo ordine? <Link to="/contacts" className="alert-link fw-semibold">Contatta il Servizio Clienti</Link>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSummaryPage;