import { play } from "../assets";

const PlayDemo = ({ className }) => {
  return (
    <div
      style={{
        width: "180px",
        position: "absolute",
        top: "90px",
        backdropFilter: "blur(3px)"
      }}
      className={`flex items-center h-[3.5rem] px-6 bg-n-8/80 rounded-[1.7rem] ${
        className || ""
      } text-base`}
    >
      <img className="w-5 h-5 mr-4" src={play} alt="Loading" />
      Play Demo
    </div>
  );
};

export default PlayDemo;
