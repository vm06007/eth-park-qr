
import Header from "./components/Header";
import Hero from "./components/Hero";
import MyLogos from "./components/MyLogos";
import Services from "./components/Services";
import Latest from "./components/Latest";
import "./index.css";

const Welcome = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <MyLogos />
        <Services />
        <Latest />
      </div>
    </>
  );
};

export default Welcome;
