import Navbar from "../components/HomePage/Navbar";
import HeroContent from "../components/HomePage/HeroContent";
import ProductShowcase from "../components/HomePage/ProductShowcase";
import Function from "../components/HomePage/Functions";
import Card from "../components/HomePage/Card";
import BigPictureSection from "../components/HomePage/BigPictureSection";
import WorkplaceCTA from "../components/HomePage/WorkPlaceCTA";
import Footer from "../components/HomePage/Footer";

const Home = () => {
    return (
        <div className="bg-white">
            <div className="relative min-h-screen overflow-hidden">

                {/* === Brighter Green Grid Background === */}
                <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: "#e6f3c2", // brighter green
                    backgroundImage: `url(${import.meta.env.BASE_URL}green-panels.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                />

                {/* === Layered Light Beams === */}
                <img
                src={`${import.meta.env.BASE_URL}light-beam.png`}
                alt="Light Beam Left"
                className="absolute w-[1200px] top-[-200px] left-[-200px] opacity-60 rotate-0 pointer-events-none z-0"
                />
                <img
                src={`${import.meta.env.BASE_URL}light-beam.png`}
                alt="Light Beam Right"
                className="absolute w-[1200px] top-[-200px] right-[-200px] opacity-60 rotate-180 pointer-events-none z-0"
                />

                {/* === Main Content === */}
                <div className="relative z-10">
                <Navbar />
                <HeroContent />
                <ProductShowcase />

                {/* Curved Top Footer Transition */}
                <div className="relative -mt-16">
                    <div className="h-16 bg-white relative">
                    <div className="absolute -top-8 left-0 right-0 h-8 bg-white rounded-t-[100%]" />
                    </div>
                </div>
                </div>
            </div>

            {/* === Rest of Page === */}
            <div>
                <div id="function-section">
                <Function />
                </div>
                <Card />
                <BigPictureSection />
                {/* <WorkplaceCTA /> */}
                <div id="footer-section">
                <Footer />
                </div>
            </div>
        </div>
    );
};

export default Home;
