import Section from "./Sections";
import { stars } from "../assets";
import Heading from "./Heading";
import TeamList from "./TeamList";

const Team = () => {
  return (
    <Section crosses className="overflow-hidden" id="team">
      <div className="container relative z-2">
        <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          <img
            src={"https://ethglobal.storage/events/bangkok/logo/default"}
            className="relative z-1"
            alt="Sphere"
          />
          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={stars}
              className="w-full"
              width={950}
              height={400}
              alt="Stars"
            />
          </div>
        </div>
        <Heading
          tag="ETHGlobal Bangkok Team"
          title="Meet The Team"
        />
        <div className="relative">
          <TeamList />
        </div>
      </div>
    </Section>
  );
};

export default Team;
