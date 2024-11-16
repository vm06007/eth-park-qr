import { venues } from "../constants";
import Heading from "./Heading";
import Section from "./Sections";
import Arrow from "../assets/svg/Arrow";
import ClipPath from "../assets/svg/ClipPath";

const Venues = () => {
  return (
    <Section id="features">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="Supported Spaces"
        />
        <div className="flex flex-wrap gap-10 mb-10">
          {venues.map((item) => (
            <a key={item.id} href="#try-it-now">
            <div
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              style={{
                backgroundImage: `url(${item.backgroundUrl})`,
              }}
            >
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                <h5 className="h5 mb-5">{item.title}</h5>
                <p className="body-2 mb-6 text-n-3">{item.text}</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={item.iconUrl}
                    width={48}
                    height={48}
                    alt={item.title}
                  />
                  {item.light && (
                    <>
                    <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                      Try it now
                    </p>
                    <Arrow />
                    </>
                  )}
                  {!item.light && (
                    <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                      Coming soon
                    </p>
                  )}
                </div>
              </div>
              {item.light && <GradientLight />}

              <div
                className="absolute inset-0.5 bg-n-8"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-10 transition-opacity hover:opacity-40">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <ClipPath />
            </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
};

const GradientLight = () => {
  return (
    <div className="absolute top-0 left-1/4 w-full aspect-square bg-radial-gradient from-[#28206C] to-[#28206C]/0 to-70% pointer-events-none" />
  );
};

export default Venues;

