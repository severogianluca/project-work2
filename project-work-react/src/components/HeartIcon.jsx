import { useState, useEffect } from "react";
import { useWishlist } from "../contexts/WishListContext";

const HeartIcon = ({ manga, sizeClass = '', customStyle = {} }) => {
  const { isMangaLiked, toggleMangaLike } = useWishlist();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (manga) {
      setLiked(isMangaLiked(manga.slug));
    }
  }, [manga, isMangaLiked]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (manga) {
      toggleMangaLike(manga);
    }
  };

  return (
    <i
      className={`${liked ? "fas" : "far"} fa-heart text-danger ${sizeClass}`}
      onClick={handleToggle}
      style={{ cursor: "pointer", ...customStyle }}
      aria-label="Aggiungi/Rimuovi dalla Wishlist"
    ></i>
  );
};

export default HeartIcon;