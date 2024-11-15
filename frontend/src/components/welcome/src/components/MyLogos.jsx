import { logos } from "../constants";
import TagLine from "./Tagline";

const MyLogos = ({ className }) => {
  const tag = "Built With ETHGlobal Bangkok Partners TECH";
  return (
    <div className={className}>
      <h5 style={{transform: "scale(1.3)"}} className="tagline mb-6 text-center text-n-1/50">
        <TagLine className="mb-4 md:justify-center">{tag}</TagLine>
      </h5>
      <ul className="flex imger">
        {logos.map((logo, index) => (
          <li
            className="flex items-center justify-center flex-1 h-[8.5rem]"
            key={index}
          >
            <a href="https://data.chain.link/feeds/polygon/mainnet/thb-usd" target="_blank">
              <img src={logo} width={134} height={28} alt={logo} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyLogos;
