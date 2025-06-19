import { NavLink } from "react-router-dom";
import logo from "../public/Gemini_Generated_Image_qf26rqf26rqf26rq.png"
import { useState } from "react";
import CartOffcanvas from "./CartOffcanvas";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishListContext";

export default function Navbar() {

    const [isCartOpen, setIsCartOpen] = useState(false);
    const { totalItemsInCart } = useCart();
    const { wishlist } = useWishlist();

    const hasItemsInWishlist = wishlist && wishlist.length > 0;

    const cartItemCountBadgeStyle = {
        position: 'absolute',
        top: '-0.4em',
        right: '-0.5em',
        backgroundColor: '#dc3545',
        color: 'white',
        paddingLeft: '0.2em',
        paddingRight: '0.2em',
        paddingTop: '0.3em',
        paddingBottom: '0.3em',
        borderRadius: '10rem',
        fontSize: '0.75em',
        fontWeight: 'bold',
        lineHeight: '1',
        minWidth: '1.8em',
        textAlign: 'center',
        zIndex: 10,
    };

    const wishListBadgeStyle = {
        position: 'absolute',
        top: '0.1em',
        right: '0.2em',
        backgroundColor: '#0d6efd',
        paddingLeft: '0.2em',
        paddingRight: '0.2em',
        paddingTop: '0.4em',
        paddingBottom: '0.3em',
        borderRadius: '10rem',
        fontSize: '0.75em',
        fontWeight: 'bold',
        lineHeight: '1',
        minWidth: '1.8em',
        textAlign: 'center',
        zIndex: 10,
    };


    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow fixed-top">
                <div className="container-fluid d-flex flex-column flex-lg-row justify-content-between align-items-center">

                    <div className="d-flex justify-content-between align-items-center w-100 flex-lg-grow-0">
                        <NavLink to="/" className="navbar-brand">
                            <img src={logo} style={{ width: "150px" }} alt="logo" />
                        </NavLink>

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className="collapse navbar-collapse justify-content-end w-100 mt-2 mt-lg-0" id="navbarNav">
                        <ul className="navbar-nav gap-3">
                            <li className="nav-item">
                                <NavLink to='/' end className="nav-link"><strong>Home page</strong></NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/manga' end className="nav-link"><strong>Manga</strong></NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/about' end className="nav-link"><strong>About</strong></NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/contacts' className="nav-link"><strong>Contacts</strong></NavLink>
                            </li>
                            <li className="nav-item btn position-relative">
                                <NavLink to='/wishlist' className="nav-link">
                                    <strong>Wishlist</strong>
                                    {hasItemsInWishlist && (
                                        <div style={wishListBadgeStyle}>
                                            <i className="bi bi-stars" style={{ fontSize: '0.9em', color: 'white' }}></i>
                                        </div>
                                    )}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="btn position-relative"
                                    onClick={() => setIsCartOpen(true)}
                                    aria-label="Apri carrello"
                                >
                                    {totalItemsInCart > 0 ? <div style={cartItemCountBadgeStyle}>{totalItemsInCart > 99 ? '99+' : totalItemsInCart}</div> : null}
                                    <i className="fa-solid fa-cart-shopping fs-4"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <CartOffcanvas isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}