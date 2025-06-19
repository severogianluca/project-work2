import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const CART_STORAGE_KEY = 'mangaShopCart'; // Chiave per localStorage

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Carica il carrello da localStorage all'avvio
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Errore nel caricamento del carrello da localStorage:", error);
      return [];
    }
  });

  // Salva il carrello in localStorage ogni volta che cartItems cambia
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Errore nel salvataggio del carrello in localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.slug === item.slug);
      if (existingItem) {
        // Se l'articolo esiste, aumenta la quantità
        return prevItems.map(i =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Altrimenti, aggiungi il nuovo articolo con quantità 1
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (slug) => {
    // Rimuove completamente l'articolo, indipendentemente dalla quantità
    setCartItems(prevItems => prevItems.filter(i => i.slug !== slug));
  };

  const decreaseQuantity = (slug) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.slug === slug
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0) // Rimuove l'articolo se la quantità diventa 0
    );
  };

  const increaseQuantity = (slug) => {
    // Funzione esplicita per aumentare la quantità (alternativa a addToCart per articoli già presenti)
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Calcola il numero totale di articoli (considerando le quantità)
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calcola il costo totale (se hai un campo 'price' negli item)
  // const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const cartTotal = cartItems.reduce((total, item) => {
    // Assicurati che effective_price sia un numero
    const price = parseFloat(item.effective_price);
    if (isNaN(price)) {
      console.warn(`Prezzo non valido per l'articolo: ${item.title}`, item);
      return total;
    }
    return total + (price * item.quantity);
  }, 0);

  // clearCart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        totalItemsInCart,
        cartTotal,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}