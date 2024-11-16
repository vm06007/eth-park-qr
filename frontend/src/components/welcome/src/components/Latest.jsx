import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from 'wagmi';
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Sections";
import Tagline from "./Tagline";
import QRCode from 'react-qr-code';
import { check, grid, loading1, gradient } from "../assets";

const contracts = {
  1: { // Ethereum Mainnet (USDC contract)
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    explorer: "https://eth.blockscout.com/",
  },
  137: { // Polygon Mainnet (Actual PayQRContract)
    address: "0x1fC490c7FD8716A9d20232B6871951e674841b4a",
    explorer: "https://polygon.blockscout.com/",
  },
  8453: { // Base Mainnet (USDC contract)
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    explorer: "https://base.blockscout.com/",
  },
};

// Define contract ABI (same for all chains)
const abi = [
  "event PaymentUpdated(address creator, string indexed baseUrl, string referenceString, address indexed tokenAddress, uint256 tokenAmount, uint256 bahtAmount, bytes32 indexed orderDataHash)",
];

const abiActual = [
  "event PaymentUpdated(address creator, string indexed baseUrl, string referenceString, address indexed tokenAddress, uint256 tokenAmount, uint256 bahtAmount, bytes32 indexed orderDataHash)",
];

// Dummy Data for now
export const latest = [
  {
    id: "0",
    title: "7กณ574 @ EmSphere",
    text: "Details about the parking",
    date: "November 15, 2024 11:23pm",
    status: "done",
    qrURL: "https://carpark.themall.co.th/?data=abe69da7b1a31",
    colorful: true,
  },
  {
    id: "1",
    title: "7กณ574 @ EmQuartier",
    text: "Details about the parking",
    date: "November 15, 2024 10:23pm",
    status: "progress",
    qrURL: "https://carpark.themall.co.th/?data=abe69da7b1a31",
  },
  {
    id: "2",
    title: "7กณ574 @ Suvarnabhumi",
    text: "Details about the parking",
    date: "November 15, 2024 10:23pm",
    status: "progress",
    qrURL: "https://carpark.themall.co.th/?data=abe69da7b1a31",
  },
  {
    id: "3",
    title: "7กณ574 @ QSNCC Venue",
    text: "Details about the parking",
    date: "November 15, 2024 10:23pm",
    status: "progress",
    qrURL: "https://carpark.themall.co.th/?data=abe69da7b1a31",
  },
  {
    id: "4",
    title: "7กณ574 @ EmQuartier",
    text: "Details about the parking",
    date: "November 15, 2024 10:23pm",
    status: "progress",
    qrURL: "https://carpark.themall.co.th/?data=abe69da7b1a31",
  },
  {
    id: "4",
    title: "7กณ574 @ EmQuartier",
    text: "Details about the parking",
    date: "November 15, 2024 10:23pm",
    status: "progress",
    qrURL: "https://carpark.themall.co.th/?data=abe69da7b1a31",
  },
];

const Latest = () => {

  const [latestEvents, setLatestEvents] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [monitorMessage, setMonitorMessage] = useState("");

  const {
    chain,
    // isConnected
  } = useAccount();

  const fetchEvents = async (provider, chainId) => {
    if (!chainId || !contracts[chainId]) {
      console.error("Unsupported chain or no contract available for this chain.");
      setLatestEvents([]);
      return;
    }

    try {
      const contract = new ethers.Contract(contracts[chainId].address, abi, provider);
      const block = await provider.getBlockNumber();

      const events = await contract.queryFilter(
        contract.filters.PaymentUpdated(),
        64350494, // from
        'latest' // to
      );

      const recentEvents = await Promise.all(
        events.slice(-5).map(async (event, i) => {
          const blockDetails = await provider.getBlock(event.blockNumber);
        events.slice(-6).map(async (event, i) => {
          const date = new Date(blockDetails.timestamp * 1000).toLocaleString();

            paid = "done";
          return {
            id: event.transactionHash,
            date,
            title: latest[i] && latest[i].title,
            status: "done",
            txHash: event.transactionHash,
          };
        })
      );
      // console.log(recentEvents, 'recentEvents');
      setLatestEvents(recentEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum
    );

    const handleChainChanged = async () => {
      // await fetchChainId(provider);
      await fetchEvents(provider, chain?.id);
    };

    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [chain?.id]);

  useEffect(() => {
    if (chain?.id) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      fetchEvents(provider, chain?.id);
    }
  }, [chain?.id]);

  // Dynamically generate block explorer URL
  const explorerUrl = chain?.id && contracts[chain?.id]?.explorer
    ? `${contracts[chain?.id].explorer}/address/${contracts[chain?.id].address}`
    : "#";

  // Dynamically generate block explorer URL
  const explorerUrlAddy = chain?.id && contracts[chain?.id]?.explorer
    ? `${contracts[chain?.id].explorer}/address/}`
    : "#";

    const explorerUrlTx = chain?.id && contracts[chain?.id]?.explorer
    ? `${contracts[chain?.id].explorer}/tx/`
    : "#";

    const monitorBalance = async (txHash) => {
      setMonitoring(true);
      setMonitorMessage("Starting balance monitoring...");

      try {
        for (let i = 0; i < 60; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
          console.log("Checking balance...");

          const response = await fetch("/api/Home/SaveProduct1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ X: txHash }),
          });

          if (response.ok) {
            const data = await response.json();
            const outstanding_balance = data.all_fee - data.all_paid;
            console.log(data);
            console.log(outstanding_balance, 'outstanding balance');

            if (outstanding_balance === 0) {
              console.log("Balance reached zero. Payment settled.");
              setMonitorMessage("Balance reached zero. Payment settled.");
              setMonitoring(false);
              // CALL BOT TO RELEASE THE CRYPTO FROM CONTRACT
              return;
            }
          } else {
            console.error(`Error checking balance: ${response.statusText}`);
          }
        }
        console.log('Balance did not reach zero within 60 seconds.');
        setMonitorMessage("Balance did not reach zero within 60 seconds.");
      } catch (error) {
        console.error("Error monitoring balance:", error);
        setMonitorMessage("Error occurred during balance monitoring.");
      }

      setMonitoring(false);
    };

  return (
    <Section className="overflow-hidden" id="latest-payments">
      <div className="container md:pb-10">
        <Heading tag="check it on-chain" title="Latest Payments" />
        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
          {latestEvents.map((item, i) => (
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
                      <div className="tagline">{item.status}</div>
                    </div>
                  </div>
                  <h4 className="h4 mb-4">{item.title}</h4>
                  <div className="body-2 text-n-4">
                  <p>
                    Requested By:{" "}
                    <a
                      href={`${contracts[chain?.id].explorer}address/${item?.from}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {item?.from}
                    </a>
                  </p>
                  <p>
                    Settled By:{" "}
                    <a
                      href={`${contracts[chain?.id].explorer}address/${item?.to}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {item?.to}
                    </a>
                  </p>
                  <p>
                    Transaction Hash:{" "}
                    <a
                      href={`${explorerUrlTx}/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {item.txHash}
                    </a>
                  </p>
                </div>
                  {(item.status !== "done") && (
                    <div>
                    <Button onClick={() => monitorBalance("abe69da7b1a31")}>
                      Request And Settle QR: {}
                    </Button>
                    {monitoring && (
                      <>
                        <br></br>
                        <a href="https://carpark.themall.co.th/?data=abe69da7b1a31" target="_blank">
                          Scan To Settle In 60 Seconds
                        </a>
                        {(item.qrURL) && (
                          <QRCode value={item.qrURL} />
                        )}
                        {monitorMessage}
                      </>
                    )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
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
        <div className="flex justify-center mt-12 md:mt-15 xl:mt-20" style={{transform: "scale(1.5)"}}>
          <a  href={explorerUrl} target="_blank">
            <Button>Show More On BlockScout EXPLORER</Button>
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Latest;
