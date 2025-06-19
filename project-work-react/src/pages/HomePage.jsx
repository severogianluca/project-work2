import HeroSpace from "../components/HeroSpace";
import Series from "../components/Series";
import Carousel from "../components/Carousel";
import CarouselPoplarity from "../components/CarouselPoplarity";
import ShippingInfoBanner from "../components/ShippingInfoBanner";
import { useEffect } from "react";
function HomePage() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="mb-5">
                <ShippingInfoBanner />
                <HeroSpace />
                <Carousel />
                <CarouselPoplarity />
                <Series />
            </div>
        </>
    )
}

export default HomePage;