import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

function AddToCartButton({ manga, viewMode, btnLg }) {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const existingCartItem = cartItems.find(item => item.slug === manga.slug);
  const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;

  const [clicked, setClicked] = useState(false);
  const handleInitialClickAnimation = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  };

  const originalButtonClasses = `btn btn-warning text-primary-emphasis mt-1 fade-button ${clicked ? "clicked" : ""} ${viewMode === "list" ? "btn-list-mode" : ""} ${btnLg === true ? 'btn-lg px-5 me-4' : ''}`;

  const handleAddToCart = () => {
    addToCart(manga);
    handleInitialClickAnimation();
  };

  const handleIncrease = () => {
    increaseQuantity(manga.slug);
  };

  const handleDecrease = () => {
    decreaseQuantity(manga.slug);
  };

  if (currentQuantity === 0) {
    return (
      <button
        className={originalButtonClasses}
        onClick={handleAddToCart}
        aria-label={`Aggiungi ${manga.title || 'articolo'} al carrello`}
      >
        <i className="fas fa-shopping-cart"></i>
        <span className='addToCart ms-2'>Aggiungi al carrello</span>
      </button>
    );
  }

  const quantityControlBaseClasses = `btn btn-warning text-primary-emphasis`;
  const quantityControlButtonClasses = `${quantityControlBaseClasses} ${btnLg ? 'btn-lg px-4' : 'px-3'}`;
  const quantityDisplayClasses = `mx-2 ${btnLg ? 'fs-5 mx-5' : ''} d-inline-block text-center`;
  const controlsContainerClasses = `d-flex align-items-center mt-1 ${viewMode === "list" ? "justify-content-start" : "justify-content-between"} ${btnLg ? 'me-4' : ''}`;

  const dynamicMinWidth = () => {
    if (btnLg) {
      return '294.89px';
    }
    if (viewMode === "list") {
      return '190.34px';
    }
    return '';
  };

  return (
    <div
      style={{ minWidth: dynamicMinWidth() }}
      className={controlsContainerClasses}
      role="group"
      aria-label={`Quantità di ${manga.title || 'articolo'} nel carrello`}
    >
      <button
        className={quantityControlButtonClasses}
        onClick={handleDecrease}
        aria-label={`Rimuovi una unità di ${manga.title || 'articolo'}`}
      >
        <i className="fas fa-minus"></i>
      </button>
      <span
        className={quantityDisplayClasses}
        style={{ minWidth: btnLg ? '40px' : '30px' }}
        aria-live="polite"
        aria-atomic="true"
      >
        {currentQuantity}
      </span>
      <button
        className={quantityControlButtonClasses}
        onClick={handleIncrease}
        aria-label={`Aggiungi una unità di ${manga.title || 'articolo'}`}
      >
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}

export default AddToCartButton;