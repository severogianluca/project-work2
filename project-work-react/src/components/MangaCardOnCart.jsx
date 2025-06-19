import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const MangaCardOnCart = ({ item, closeCartOffcanvas }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const {
    title,
    imagePath,
    effective_price,
    series_name,
    slug,
    quantity
  } = item;

  const itemTotalPrice = effective_price * quantity;

  const formatPrice = (price) => {
    if (typeof price !== 'number') {
      return 'N/A';
    }
    return '€ ' + price.toFixed(2).replace('.', ',');
  };

  const handleImageLinkClick = () => {
    if (closeCartOffcanvas) {
      closeCartOffcanvas(); // Chiama la funzione per chiudere l'offcanvas
    }
    // La navigazione del Link procederà normalmente
  };

  return (
    <li className="list-group-item p-3">
      <div className="row g-3 align-items-center">
        {/* Colonna Immagine */}
        <div className="col-3 text-center">
          <Link to={'/manga/' + slug} onClick={handleImageLinkClick}>
            <img
              src={imagePath}
              alt={title}
              className="img-fluid rounded"
              style={{ maxHeight: '120px', objectFit: 'contain', display: 'inline-block' }}
            />
          </Link>
        </div>


        <div className="col-9 ">
          <div className="d-flex flex-column justify-content-between h-100">

            {/* Riga Superiore: Titolo, Serie, Prezzo Unitario */}
            <div>
              <h6
                className="mb-1"
                title={title}
                style={{ wordBreak: 'break-word', hyphens: 'auto', lineHeight: '1.2' }}
              >
                {title}
              </h6>
              {series_name && (
                <p
                  className="mb-1 text-muted small"
                  style={{ wordBreak: 'break-word', hyphens: 'auto', lineHeight: '1.2' }}
                >
                  {series_name}
                </p>
              )}
              <p className="mb-2 fw-bold text-body-tertiary" >
                {formatPrice(effective_price)} cad.
              </p>
            </div>

            {/* Riga Inferiore: Controlli Quantità, Prezzo Totale, Rimuovi */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mt-auto pt-2 border-top">
              {/* Gruppo Controlli Quantità */}
              <div className="d-flex align-items-center me-3 mb-2 mb-sm-0">
                <button
                  className="btn btn-outline-secondary btn-sm py-1 px-2"
                  onClick={() => decreaseQuantity(slug)}
                  aria-label="Diminuisci quantità"
                  style={{ lineHeight: '1' }}
                  disabled={quantity <= 1}
                >
                  &ndash;
                </button>
                <span className="mx-2 fw-bold" style={{ minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                <button
                  className="btn btn-outline-secondary btn-sm py-1 px-2"
                  onClick={() => increaseQuantity(slug)}
                  aria-label="Aumenta quantità"
                  style={{ lineHeight: '1' }}
                >
                  +
                </button>
              </div>

              {/* Gruppo Prezzo Totale e Rimuovi */}
              <div className="d-flex align-items-center ms-sm-auto">
                <span className="fw-bold me-2 me-md-3" style={{ whiteSpace: 'nowrap' }}>
                  {formatPrice(itemTotalPrice)}
                </span>
                <button
                  className="btn btn-danger btn-sm py-1 px-2"
                  onClick={() => removeFromCart(slug)}
                  aria-label="Rimuovi articolo"
                  title="Rimuovi dal carrello"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MangaCardOnCart;