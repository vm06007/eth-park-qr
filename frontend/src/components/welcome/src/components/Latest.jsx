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
  1: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    explorer: "https://eth.blockscout.com/",
  },
  137: {
    address: "0x1fC490c7FD8716A9d20232B6871951e674841b4a",
    explorer: "https://polygon.blockscout.com/",
  },
  8453: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    explorer: "https://base.blockscout.com/",
  },
  42161: {
    address: "0x1Ba305534774Cb79E74D6D9C702C1451Cc32b8e4",
    explorer: "https://arbitrum.blockscout.com/",
  },
};

// Define contract ABI (same for all chains)
const abi = [
  "event PaymentUpdated(address creator, string indexed baseUrl, string referenceString, address indexed tokenAddress, uint256 tokenAmount, uint256 bahtAmount, bytes32 indexed orderDataHash)",
  "function amountsFromOrder(bytes32 orderDataHash) view returns (address tokenAddress, uint256 tokenAmountTotal, uint256 bahtAmountTotal, uint256 tokenAmountIssued)"
];

// Helper Data
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

const shortenHash = (hash, length = 6) => {
  if (!hash) return "";
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

const Latest = () => {

  const seconds = 60;
  const [latestEvents, setLatestEvents] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [monitorMessage, setMonitorMessage] = useState("");
  const [countdown, setCountdown] = useState(seconds);
  const [trigger, setTrigger] = useState(false);
  let diff = 0;

  const {
    chain,
    address
    // isConnected
  } = useAccount();

  const fetchEvents = async (provider, chainId) => {
    if (!chainId || !contracts[chainId]) {
      console.error("Unsupported chain or no contract available for this chain.");
      setLatestEvents([]);
      return;
    }

    if (process.env.REACT_APP_MULTIBAAS_API_KEY) {
      const query = new URLSearchParams({
        chain: 'polygon',
        contract_address: '0x1fC490c7FD8716A9d20232B6871951e674841b4a',
        contract_label: 'ethparkqr1',
      }).toString();

      const hostname = 'j4kvg556rbaspaammrbt6lniqi.multibaas.com';
      const resp = await fetch(
        `https://${hostname}/api/v0/events?${query}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_MULTIBAAS_API_KEY}`,
          }
        }
      );

      const data = await resp.text();
      console.log(data, 'events');
    }

    try {
      const contract = new ethers.Contract(
        contracts[chainId].address,
        abi,
        provider
      );
      // const block = await provider.getBlockNumber();
      // Fetch the latest PaymentUpdated events
      const events = await contract.queryFilter(
        contract.filters.PaymentUpdated(),
        64357300, // from
        'latest' // to
      );

      console.log(events, 'events');

      const recentEvents = await Promise.all(
        events.slice(-5).reverse().map(async (event, i) => {

          const blockDetails = await provider.getBlock(
            event.blockNumber
          );

          const date = new Date(blockDetails.timestamp * 1000).toLocaleString();

          // Fetch the mapping data for the event's orderDataHash
          console.log(event.args.orderDataHash, 'orderDataHash');
          const orderData = await contract.amountsFromOrder(
            event.args.orderDataHash
          );

          const tokenAmountTotal = ethers.BigNumber.from(orderData.tokenAmountTotal);
          const tokenAmountIssued = ethers.BigNumber.from(orderData.tokenAmountIssued);
          diff = tokenAmountTotal.sub(tokenAmountIssued);

          let paid = tokenAmountTotal.gt(tokenAmountIssued)
            ? "awaiting"
            : "done";

          if (i === events.length - 1) {
            // at least one event is marked as "done" for demo
            paid = "done";
          }

          return {
            id: event.transactionHash,
            date,
            orderHash: event.args.orderDataHash,
            orderId: event.args.referenceString,
            from: event.args.creator,
            // to: event.args.to,
            // value: ethers.utils.formatEther(event.args.value),
            title: latest[i] && latest[i].title,
            qrURL: latest[i] && latest[i].qrURL,
            // text: `From: ${event.args.from} To: ${event.args.to} Amount: ${ethers.utils.formatEther(event.args.value)}`,
            status: paid,
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
    let provider;

    try {
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        console.warn("No wallet detected. Using a fallback provider.");
        // Use a fallback read-only provider
        provider = new ethers.providers.JsonRpcProvider(
          "https://polygon-mainnet.infura.io/v3/<YourKey>"
        );
      }

      const handleChainChanged = async () => {
        try {
          await fetchEvents(provider, chain?.id);
        } catch (error) {
          console.error("Error handling chain change:", error);
        }
      };

      // Listen for chain changes
      if (window.ethereum) {
        window.ethereum.on("chainChanged", handleChainChanged);
      }

      // Cleanup the event listener on unmount
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    } catch (error) {
      console.error("Failed to initialize provider:", error);
    }
  }, [chain?.id]);


  useEffect(() => {
    if (chain?.id) {
      let provider;

      try {
        if (window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
          console.warn("No wallet detected. Using a fallback provider.");
          // Use a fallback read-only provider
          provider = new ethers.providers.JsonRpcProvider(
            "https://polygon-mainnet.infura.io/v3/<YourKey>"
          );
        }

        fetchEvents(provider, chain?.id);
      } catch (error) {
        console.error("Failed to initialize provider:", error);
      }
    }
  }, [chain?.id, trigger]);

  const toggleTrigger = () => {
    setTrigger((prev) => !prev);
  };

  // Dynamically generate block explorer URL
  const explorerUrl = chain?.id && contracts[chain?.id]?.explorer
    ? `${contracts[chain?.id].explorer}/address/${contracts[chain?.id].address}`
    : "#";

    const explorerUrlTx = chain?.id && contracts[chain?.id]?.explorer
    ? `${contracts[chain?.id].explorer}/tx/`
    : "#";

    const monitorBalance = async (orderId, orderHash) => {

      setCountdown(seconds);
      setMonitoring(true);
      setMonitorMessage(`Starting balance monitoring...`);

      try {
        for (let i = 0; i < seconds; i++) {

          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

          console.log("Checking balance...");
          setCountdown((prev) => prev - 1);

          const response = await fetch("/api/Home/SaveProduct1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ X: orderId }),
          });

          if (response.ok) {
            const data = await response.json();
            const outstanding_balance = data.all_fee - data.all_paid;
            console.log(data);
            console.log(outstanding_balance, 'outstanding balance');

            if (outstanding_balance === 0 || (i > 2 && data?.trans_information?.[0]?.exit_car === true)) {
              console.log("Balance reached zero. Payment settled.");
              setMonitorMessage("Balance reached zero. Payment settled.");

              // Update the status of the corresponding entry
              setLatestEvents((prevEvents) =>
                prevEvents.map((event) =>
                  event.orderId === orderId
                    ? { ...event, status: "done" }
                    : event
                )
              );

              // Backend call to release the crypto
              try {
                const payload = {
                  recipient: address,
                  orderHash: orderHash,
                };
                console.log(payload, 'payload');
                const botResponse = await fetch("/localapi/resolve_order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });

                if (!botResponse.ok) {
                  throw new Error(`Backend API Error: ${botResponse.statusText}`);
                }

                const botData = await botResponse.json();
                console.log("Transaction hash from backend:", botData.tx_hash);
                setMonitorMessage(`Crypto released. Transaction hash: ${botData.tx_hash}`);
              } catch (botError) {
                console.error("Error calling backend to release crypto:", botError);
                setMonitorMessage("Error occurred while releasing crypto.");
              }

              setMonitoring(false);
              setCountdown(0);
              return;
            }
          } else {
            console.error(`Error checking balance: ${response.statusText}`);
          }
        }
        console.log(`Balance did not reach zero within ${seconds} seconds.`);
        setMonitorMessage(`Balance did not reach zero within ${seconds} seconds.`);
      } catch (error) {
        console.error("Error monitoring balance:", error);
        setMonitorMessage("Error occurred during balance monitoring.");
      }

      setMonitoring(false);
    };

  return (
    <Section className="overflow-hidden" id="latest-payments">
      <div className="container md:pb-10" onClick={() => {toggleTrigger()}}>
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
                  <p className="hidden">
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
                    Order Hash: <span>{shortenHash(item.orderHash)}</span>
                    <span className="hidden">
                      {item.orderHash}
                    </span>
                    <span className="hidden">
                      {item.orderId}
                    </span>
                  </p>
                  <p>
                    Transaction Hash:{" "}
                    <a
                      href={`${explorerUrlTx}/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {shortenHash(item.txHash)}
                    </a>
                  </p>
                </div>
                  {(item.status !== "done") && (
                    <div>
                    <div style={{transform: "scale(1.3)", marginLeft: "35px"}}>
                    <Button onClick={() => monitorBalance(
                      item.orderId,
                      item.orderHash
                    )}>
                      Click To Settle QR Payment {}
                    </Button>
                    </div>
                    {monitoring && (
                      <>
                        <br></br>
                        <div className="flex" style={{flexDirection: "row-reverse"}}>
                        <span className="counter">
                          <a href={`https://carpark.themall.co.th/?data=${item.orderId}`} target="_blank">
                            Scan To Settle In {countdown} seconds
                          </a>
                        </span>
                        {(item.qrURL) && (
                          <QRCode value={`https://carpark.themall.co.th/?data=${item.orderId}`} />
                        )}
                        </div>
                        <br></br>
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
