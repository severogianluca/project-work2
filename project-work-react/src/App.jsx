import { BrowserRouter, Route, Routes } from "react-router-dom"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "./pages/HomePage"
import DefaultLayout from "./layouts/DefaulLayout"
import MangaDetailsPage from "./pages/MangaDetailsPage"
import MangaPage from "./pages/MangaPage"
import NotFound from "./pages/NotFound"
import ContactsPage from "./pages/ContactsPage"
import AboutPage from "./pages/AboutPage"
import SerieDetailsPage from "./pages/SeriesDetailPage"
import Wishlist from "./pages/WishList";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { WishlistProvider } from "./contexts/WishListContext";
import { CartProvider } from "./contexts/CartContext";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";

function App() {
  return (
    <>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<DefaultLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/manga" element={<MangaPage />} />
                <Route path="/manga/:slug" element={<MangaDetailsPage />} />
                <Route path="/serie/:slug" element={<SerieDetailsPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/privacy&policy" element={<PrivacyPolicyPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-summary" element={<OrderSummaryPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </>
  )
}

export default App;