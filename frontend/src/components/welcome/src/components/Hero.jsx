import { curve, main } from "../assets";
import Section from "./Sections";
import { BackgroundCircles, Gradient } from "./design/Hero";
import { useRef } from "react";
import PlayDemo from "./PlayDemo";

const Hero = () => {
  const parallaxRef = useRef(null);
  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses4
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20">
          <h1 className="h1 mb-6">
            Settle Parking QR Payments In Thailand with {` `}
            <span className="inline-block relative">
              Crypto{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Scan any supported QR-Ticket and settle it on-chain
          </p>
        </div>
        <Gradient />
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="opacity-70 cursor-pointer transition-opacity hover:opacity-100 relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div style={{background: "rgba(75, 85, 99, 0.5)"}} className="relative bg-n-8 rounded-[1rem]">
              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                <img
                  src={main}
                  className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[-23%]"
                  width={1024}
                  alt="concept"
                />
                <PlayDemo className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />
              </div>
            </div>
          </div>
          <Gradient />
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
          </div>
          <BackgroundCircles />
        </div>
      </div>
    </Section>
  );
};

export default Hero;
