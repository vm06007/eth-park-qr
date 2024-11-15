
import Header from "./components/Header";
import Hero from "./components/Hero";
import MyLogos from "./components/MyLogos";
import Services from "./components/Services";
import "./index.css";

const Welcome = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <MyLogos />
        <Services />
      </div>
    </>
  );
};

export default Welcome;
