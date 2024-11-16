import { check } from "../assets";

const team = [
  {
    id: "0",
    title: "Rene Hochmuth",
    description: "Solidity Developer / Script Developer",
    features: [
      "Responsible For Smart Contract",
      "Responsible For 0Layer Connection",
    ],
  },
  {
    id: "1",
    title: "Vitalik Marincenko",
    description: "Frontend Developer / Backend Developer",
    features: [
      "Responsible For Frontend",
      "Responsible For CoinBase Tool",
    ],
  },
  {
    id: "2",
    title: "Surasawadee AI",
    description: "Artificial Intelligence Instance / Generator",
    features: [
      "Helps Generatic Code Snippets",
      "Helps With System Architecture",
    ],
  },
];

const TeamList = () => {
  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap" style={{justifyContent: "center"}}>
      {team.map((item) => (
        <div
          key={item.id}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-14 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{item.title}</h4>
          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {item.description}
          </p>
          <ul>
            {item.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start py-5 border-t border-n-6"
              >
                <img src={check} width={24} height={24} alt="Check" />
                <p className="body-2 ml-4">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeamList;
