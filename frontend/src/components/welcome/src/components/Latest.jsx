import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Sections";
import Tagline from "./Tagline";
import { check, grid, loading1, gradient } from "../assets";

// USDC contract for now....
const contractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const abi = [
  // Add the ABI of your contract here, specifically the Transfer event
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

// Dummy Data for now
export const latest = [
  {
    id: "0",
    title: "7กณ574 @ EmSphere",
    text: "Details about the parking",
    date: "November 15, 2024 11:23pm",
    status: "done",
    // qrURL: ,
    colorful: true,
  },
  {
    id: "1",
    title: "7กณ574 @ EmQuartier",
    text: "Details about the parking",
    date: "November 15, 2024 10:23pm",
    status: "progress",
    // qrURL: ,
  },
  {
    id: "2",
    title: "7กณ574 @ Suvarnabhumi",
    text: "Details about the parking",
    date: "November 15, 2024 11:00pm",
    status: "done",
    // qrURL: ,
  },
  {
    id: "3",
    title: "7กณ574 @ QSNCC Venue",
    text: "Details about the parking",
    date: "November 15, 2024 10:45am",
    status: "progress",
    // qrURL: ,
  },
  {
    id: "3",
    title: "7กณ574 @ QSNCC Venue",
    text: "Details about the parking",
    date: "November 15, 2024 10:45am",
    status: "progress",
    // qrURL: ,
  },
];

const Latest = () => {

  const [latestEvents, setLatestEvents] = useState([]);

  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  );

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {

        const block = await provider.getBlockNumber();

        // Fetch the latest 5 Transfer events from recent blocks
        const events = await contract.queryFilter(
          contract.filters.Transfer(),
          block - 100,
          block
        );

        console.log(latest, 'latest');

        const recentEvents = await Promise.all(
          events.slice(-5).map(async (event, i) => {
            console.log(i, 'i');
            console.log(latest[i], 'i');
            const blockDetails = await provider.getBlock(event.blockNumber);
            const date = new Date(blockDetails.timestamp * 1000).toLocaleString();

            return {
              id: event.transactionHash,
              date,
              title: latest[i] && latest[i].title,
              text: `From: ${event.args.from} To: ${event.args.to} Amount: ${ethers.utils.formatEther(event.args.value)}`,
              status: "done",
            };
          })
        );

        setLatestEvents(recentEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    // Listen for new blocks
    provider.on("block", fetchEvents);

    // Clean up the event listener when the component unmounts
    return () => {
      provider.off("block", fetchEvents);
    };
  }, []);

  return (
    <Section className="overflow-hidden" id="latest">
      <div className="container md:pb-10">
        <Heading tag="check it on-chain" title="Latest Payments" />
        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
          {latestEvents.map((item, i) => {
            return (
              <div
                className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-6`}
                key={i}
              >
                <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                  <div className="absolute top-0 left-0 max-w-full">
                    <img
                      className="w-full"
                      src={grid}
                      width={550}
                      height={550}
                      alt="Grid"
                    />
                  </div>
                  <div className="relative z-1">
                    <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-10">
                      <Tagline>{item.date}</Tagline>
                      <div className="flex items-center px-8 py-1 bg-n-1 rounded text-n-8">
                        <img
                          className="mr-2.5"
                          src={item.status === "done" ? check : loading1}
                          width={16}
                          height={16}
                          alt={item.status}
                        />
                        <div className="tagline">
                          Paid
                        </div>
                      </div>
                    </div>
                    <h4 className="h4 mb-4">{item.title}</h4>
                    <p className="body-2 text-n-4">{item.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="absolute top-[18.25rem] -left-[30.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
              <img
                className="w-full"
                src={gradient}
                width={942}
                height={942}
                alt="Gradient"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
          <Button href="#">Show More On Contract Side</Button>
        </div>
      </div>
    </Section>
  );
};

export default Latest;
