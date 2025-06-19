import { useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import MangaCardOnCart from './MangaCardOnCart';
import { Link } from 'react-router-dom';

const CartOffcanvas = ({ isOpen, onClose }) => {
    const offcanvasHtmlRef = useRef(null);
    const bsOffcanvasInstanceRef = useRef(null);
    const { cartItems, cartTotal, totalItemsInCart } = useCart();

    useEffect(() => {
        if (offcanvasHtmlRef.current && window.bootstrap?.Offcanvas) {
            if (!bsOffcanvasInstanceRef.current) {
                bsOffcanvasInstanceRef.current = new window.bootstrap.Offcanvas(offcanvasHtmlRef.current);
            }
        }
    }, []);

    useEffect(() => {
        const htmlElement = offcanvasHtmlRef.current;
        const instance = bsOffcanvasInstanceRef.current;

        if (htmlElement && instance) {
            const handleClose = () => onClose();
            htmlElement.addEventListener('hidden.bs.offcanvas', handleClose);
            return () => htmlElement.removeEventListener('hidden.bs.offcanvas', handleClose);
        }
    }, [onClose]);

    useEffect(() => {
        const instance = bsOffcanvasInstanceRef.current;
        if (instance) {
            if (isOpen) instance.show();
            else instance.hide();
        }
    }, [isOpen]);

    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return 'N/A';
        }
        return ' € ' + price.toFixed(2).replace('.', ',');
    };

    const SHIPPING_COST = 5.99;
    const FREE_SHIPPING_THRESHOLD = 50.00;

    const subTotal = cartTotal;
    const effectiveShippingCost = subTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const finalOrderTotal = subTotal + effectiveShippingCost;

    let amountMissingForFreeShipping = 0;
    if (subTotal >= 0 && subTotal < FREE_SHIPPING_THRESHOLD) {
        amountMissingForFreeShipping = FREE_SHIPPING_THRESHOLD - subTotal;
    }

    return (
        <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="cartOffcanvas"
            aria-labelledby="cartOffcanvasLabel"
            ref={offcanvasHtmlRef}
        >
            <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title" id="cartOffcanvasLabel">Il tuo carrello</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body d-flex flex-column p-3">
                {cartItems.length === 0 ? (
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                        <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <p className="text-center text-muted fs-5">Il tuo carrello è vuoto.</p>
                        <button
                            type="button"
                            className="btn btn-outline-primary mt-3"
                            onClick={onClose}
                        >
                            Continua lo shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-3" style={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                            {cartItems.map(item => (
                                <MangaCardOnCart
                                    key={item.slug}
                                    item={item}
                                    closeCartOffcanvas={onClose}
                                />
                            ))}
                        </div>
                        <div className="mt-auto pt-3 border-top">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted">Articoli totali:</span>
                                <span className="fw-semibold">{totalItemsInCart}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted">Subtotale:</span>
                                <span className="fw-semibold">{formatPrice(subTotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">Spedizione:</span>
                                <span className={`fw-semibold ${effectiveShippingCost === 0 ? 'text-success' : ''}`}>
                                    {effectiveShippingCost === 0 ? 'Gratuita' : formatPrice(effectiveShippingCost)}
                                </span>
                            </div>
                            {subTotal >= 0 && subTotal < FREE_SHIPPING_THRESHOLD && amountMissingForFreeShipping > 0.009 && (
                                <div className="text-end text-success small mt-1 mb-2">
                                    Aggiungi altri <strong className="text-decoration-underline">{formatPrice(amountMissingForFreeShipping)}</strong> per la spedizione gratuita!
                                </div>
                            )}
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                                <h5 className="mb-0 fw-bold">Totale Ordine:</h5>
                                <h5 className="mb-0 fw-bold ">
                                    {formatPrice(finalOrderTotal)}
                                </h5>
                            </div>
                            <Link to={'/checkout'} className="d-grid text-decoration-none">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 btn-lg py-2 fw-semibold"
                                    onClick={onClose}
                                >
                                    Vai al Pagamento
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default CartOffcanvas;