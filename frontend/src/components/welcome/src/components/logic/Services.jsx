import axios from "axios";
import { gradient } from '../../assets';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { rainbowkitConfig } from "@/config/rainbowkitConfig";
import { ethers } from 'ethers';
import useCreateCharge from '@/hooks/useCreateCharge';
import { waitForTransactionReceipt } from "wagmi/actions";
import ReactJson from 'react-json-view';
import { file02, sliders04, check } from '../../assets';
import {
  Checkout,
  CheckoutButton,
} from '@coinbase/onchainkit/checkout';

const contractAddress = "0x1fC490c7FD8716A9d20232B6871951e674841b4a";
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_baseUrl", "type": "string" },
      { "internalType": "string", "name": "_referenceString", "type": "string" },
      { "internalType": "uint256", "name": "_bahtAmount", "type": "uint256" }
    ],
    "name": "payQRNative",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const properties = [
  "Plate Number",
  "Parking Space",
  "Parking Time",
  "Parking Status",
  "Balance To Pay",
];

export const PaymentHandler = ({ data, scan, api }) => {

  const [kubThbPrice, setKubThbPrice] = useState(null);
  const [polThbPrice, setPolThbPrice] = useState(null);
  const [ethThbPrice, setEthThbPrice] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const videoRef = useRef(null);
  let amount = 0;

  const thbUsdContractAddress = "0x5164Ad28fb12a5e55946090Ec3eE1B748AFb3785";
  const thbUsdABI = [
    {
      inputs: [],
      name: "latestAnswer",
      outputs: [{ internalType: "int256", name: "", type: "int256" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  // Fetch THB/USD price
  const { data: thbUsdPrice } = useReadContract({
    address: thbUsdContractAddress,
    abi: thbUsdABI,
    functionName: "latestAnswer",
  });

  const {
    chain,
    // isConnected
  } = useAccount();

  const handleVideoReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const info = api?.trans_information?.[0];

  const parkedOrExited = info?.exit_car
    ? 'Exited'
    : 'Parked';

  const allowOldPayment = false;

  amount = parkedOrExited === 'Exited' && allowOldPayment
    ? 1
    : info?.ParkingFee - info?.paid || 0;
    // : info?.ParkingFee || 0;

  let mallName = '...';
  if (info?.entrygate_name?.includes('EMS')) mallName = 'EmSphere Mall';
  if (info?.entrygate_name?.includes('EMQ')) mallName = 'EmQuartier Mall';

  const initialValues = [
    info?.License,
    `${mallName}`,
    `${info?.ParkingTime}`,
    `${parkedOrExited}`,
    `${amount || `0`} THB`,
  ];

  // Fetch KUB and POL prices from Bitkub API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          "https://api.bitkub.com/api/market/ticker"
        );
        setKubThbPrice(
          response.data.THB_KUB.last
        );
        setPolThbPrice(
          response.data.THB_POL.last
        );
        setEthThbPrice(
          response.data.THB_ETH.last
        )
      } catch (error) {
        console.info("Failed to fetch price data:", error);
      }
    };

    fetchPrices();
  }, []);

  const calculateKubAmount = (thbAmount) => {
    if (!kubThbPrice) {
      console.info("Missing required price data: KUB/THB.");
      return 0;
    }

    const thbInKub = thbAmount / kubThbPrice; // Convert THB to KUB
    return thbInKub;
  };

  const calculatePolAmount = (thbAmount) => {
    if (!polThbPrice) {
      console.info("Missing required price data: POL/THB.");
      return 0;
    }

    const thbInPol = thbAmount / polThbPrice; // Convert THB to POL
    return thbInPol;
  };

  const calculateEthAmount = (thbAmount) => {
    if (!ethThbPrice) {
      console.info("Missing required price data: POL/ETH.");
      return 0;
    }

    const thbInEth = thbAmount / ethThbPrice; // Convert THB to ETH
    return thbInEth;
  };

  // send a bit more to cover for sure, unused amount returned (refunded)
  const amountInPol = calculatePolAmount(amount) * 1.10;
  const amountInKub = calculateKubAmount(amount) * 1.10;
  const amountInEth = calculateEthAmount(amount) * 1.10;

  const { writeContractAsync } = useWriteContract();

  const payForParking = async (
    amount
  ) => {
    const amountFull = ethers.utils.parseUnits(
      amount.toString(),
      'ether'
    )

    isCreatingOrder = true;

    const args = [
      "https://carpark.themall.co.th/?data=", // _baseUrl
      scan, // _referenceString
      amountFull, // bahtAmount
    ];

    console.log(amountInEth, 'amountInEth');

    const decimals = 18; // Token decimals (usually 18 for ERC-20 tokens)

    const amountRounded = chain?.id === 137
      ? amountInPol.toFixed(decimals)
      : amountInEth.toFixed(decimals);

    const amountTrue = ethers.utils.parseUnits(
      amountRounded,
      'ether'
    );

    const value = amountTrue;

    const contractAddress = chain?.id === 137
      ? "0x1fC490c7FD8716A9d20232B6871951e674841b4a"
      : "0x5740CAD06B485E33af1384596bb7388Cd2df69bB";

    try {
      setLoading(true);
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: 'payQRNative',
        args: args,
        value: value,
      });

      console.log(txHash, 'txHash');

      setTransactionHash(txHash);
      setActiveTab(3);

      await waitForTransactionReceipt(rainbowkitConfig, {
        confirmations: 1,
        hash: txHash,
      });

      setLoading(false);
      console.log(txHash, 'txHash');
      console.log(response, 'response');
      setTransactionHash(txHash);
      setActiveTab(3);

    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  const { createCharge } = useCreateCharge();

  const chargeHandler = useCallback(() => {
    const chargeDetails = {
      name: 'commerce template charge',
      description: 'commerce template charge description',
      pricing_type: 'fixed_price',
      metadata: {
        custom_field: "https://carpark.themall.co.th/?data=",
        custom_field_two: scan,
      },
      local_price: {
        amount: amount.toString(),
        currency: 'THB',
      },
    };
    return createCharge(chargeDetails);
  }, [amount]);

  const handleStatusChange = (status) => {
    const { statusName, statusData } = status;
    console.log('status', status);
    console.log('statusData', statusData);
    console.log('statusName', statusName);
    switch (statusName) {
      case 'success':
        setActiveTab(3);
      case 'pending':
        // handle payment pending
      case 'error':
        // handle error
      default:
        // handle 'init' state
    }
  };

  let isCreatingOrder = false;

  return (
    <>
      <div className="absolute top-0 -left-[10rem] w-[56.625rem] h-[56.625rem] opacity-50 mix-blend-color-dodge pointer-events-none">
        <img
          className="absolute top-1/2 left-1/2 w-[79.5625rem] max-w-[79.5625rem] h-[88.5625rem] -translate-x-1/2 -translate-y-1/2"
          src={gradient}
          width={1417}
          height={1417}
          alt="Gradient"
        />
      </div>
      <ul className="mt-15">
        {data && (
          <div className="switcher">
            <img
              alt="tab-2-activator"
              className={`cursor-pointer ${activeTab === 2 ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
              width={24}
              height={24}
              src={file02}
              onClick={() => setActiveTab(2)}
            />
            <img
              alt="tab-1-activator"
              className={`cursor-pointer ${activeTab === 1 ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
              width={24}
              height={24}
              src={sliders04}
              onClick={() => setActiveTab(1)}
            />
          </div>
        )}
        {data && activeTab === 3 && (
          <div className="video-holder" onClick={handleVideoReplay}>
            <video ref={videoRef} autoPlay src="https://cdn.dribbble.com/users/2397255/screenshots/14467709/media/7f5f83a102e24e362d442194ca1a07b6.mp4"></video>
            <div className="txHolder">
            <h3 className="text-center font-bold text-green-500">
              Payment Completed
            </h3>
              {transactionHash && (
                <a
                  href={`https://polygon.blockscout.com/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Transaction
                </a>
              )}
              </div>
          </div>
        )}
        {data && activeTab === 2 && (
          <div className="abs">
            <ReactJson theme="monokai" src={api} collapsed={1} />
          </div>
        )}
        {data && activeTab === 1 && properties.map((item, index) => (
          <li key={index} className="flex px-4 items-start py-4 border-t border-n-6">
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div className="flex">
                <img width={24} height={24} src={check} />
                <p className="ml-4">{item}</p>
              </div>
              <div>{info && initialValues[index]}</div>
            </div>
          </li>
        ))}
      </ul>
      {data && (
        <div className="px-5 mt-2 relative">
          {(chain?.id === 1 || chain?.id === 137 || chain?.id === 42161) ? (
            <button
              onClick={() => {
                // setActiveTab(3);
                payForParking(amount);
              }}
              disabled={isCreatingOrder || !amount}
              className={`w-full mt-6 py-3 px-4 rounded text-white font-bold ${
                chain?.id === 1
                  ? 'bg-green-500 hover:bg-green-700'
                  : chain?.id === 42161
                    ? 'bg-blue-500 hover:bg-blue-700'
                    : 'bg-purple-500 hover:bg-purple-700'
              }`}
            >
              {loading
                ? 'Processing...'
                : chain?.id === 1
                  ? `Pay ${amount.toFixed(2)} THB with ${amountInKub.toFixed(4)} KUB`
                  : chain?.id === 42161
                    ? `Pay ${amountInEth.toFixed(4)} ETH`
                    : `Pay ${amountInPol.toFixed(4)} POL`
              }
            </button>
          ) : (
            <Checkout
              key={amount}
              onStatus={handleStatusChange}
              chargeHandler={chargeHandler}
            >
              <CheckoutButton
                coinbaseBranded={true}
                text={`Pay ${amount} THB with Crypto`}
                disabled={!amount}
              />
            </Checkout>
          )}
        </div>
      )}
    </>
  );
};



