import Header from "./components/Header";
import Hero from "./components/Hero";
import "./index.css";

const Welcome = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
      </div>
    </>
  );
};

export default Welcome;
