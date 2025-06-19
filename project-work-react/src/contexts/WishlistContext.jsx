import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

// Hook personalizzato per accedere al contesto della wishlist
export const useWishlist = () => {
    return useContext(WishlistContext);
};

// Provider
export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const localData = localStorage.getItem('wishlist');
            // Parsifica i dati JSON dal localStorage, se presenti, altrimenti un array vuoto
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Errore nel caricamento della wishlist dal localStorage:", error);
            return [];
        }
    });

    // salva la wishlist nel localStorage ogni volta che cambia
    useEffect(() => {
        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error("Errore nel salvataggio della wishlist nel localStorage:", error);
        }
    }, [wishlist]);

    // controllo la presenza
    const isMangaLiked = (mangaSlug) => {
        return wishlist.some((item) => item.slug === mangaSlug);
    };

    //aggiungere o rimuovere un manga dalla wishlist
    const toggleMangaLike = (manga) => {
        setWishlist((prevWishlist) => {
            const existingMangaIndex = prevWishlist.findIndex((item) => item.slug === manga.slug);

            if (existingMangaIndex !== -1) {
                const updatedWishlist = prevWishlist.filter((item) => item.slug !== manga.slug);
                return updatedWishlist;
            } else {
                return [...prevWishlist, manga];
            }
        });
    };

    // Valori del contesto
    const value = {
        wishlist,
        isMangaLiked,
        toggleMangaLike,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};