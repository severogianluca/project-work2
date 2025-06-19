import React, { useState } from 'react';

let bannerDismissedDuringThisPageLoad = false;

function ShippingInfoBanner() {
    const [isVisible, setIsVisible] = useState(!bannerDismissedDuringThisPageLoad);

    const handleDismiss = () => {
        setIsVisible(false);
        bannerDismissedDuringThisPageLoad = true;
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="container alert alert-info d-flex justify-content-between align-items-center py-2 px-3 small mt-3 mb-0 rounded-0"
            role="alert"
            aria-live="polite"
        >
            <span className="text-center flex-grow-1">
                <i className="fas fa-truck me-2"></i>
                Spedizione gratuita per ordini superiori a €50 al netto di sconti!
            </span>
            <button
                type="button"
                className="btn-close"
                onClick={handleDismiss}
                aria-label="Chiudi messaggio"
            ></button>
        </div>
    );
}

export default ShippingInfoBanner;