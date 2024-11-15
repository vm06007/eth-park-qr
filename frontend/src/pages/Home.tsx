import InfiniteScroll from "@/components/home/InfiniteScroll";
import Github from "@/components/icons/Github";
import Button from "@/components/ui/button";
import Starters from "@/components/home/Starters";
import { useState } from 'react';
// import QRCode from 'react-qr-code';
import { Scanner } from '@yudiel/react-qr-scanner';

export function Home() {

  const [data, setData] = useState(null);
  const [scan, setScan] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleError = (err: any) => {
    console.error(err);
    alert('must allow camera access to scan QR code');
  };

  const sendCodeToAPI = async (code: any) => {
    try {
      // based on QR code data, send a request to the API
      const response = await fetch("/api/Home/SaveProduct1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // this is the response from the API
        // https://carpark.themall.co.th/?data={code_of_qr}
        body: JSON.stringify(
          { X: code }
        ),
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.info("API request failed:", error);
    }
  };

  const parseQRCodeData = (url: any) => {
    try {
      const urlObj = new URL(url);
      const extracted = urlObj.searchParams.get("data");

      if (extracted) {
        // @ts-ignore
        setScan(extracted);
        // @ts-ignore
        sendCodeToAPI(extracted);
      }
    } catch (error) {
      console.info("Invalid URL format:", error);
    }
  };

  const scrollToTabs = () => {
    const tabsSection = document.getElementById("starters");
    if (tabsSection) {
      tabsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="max-w-[1100px] mx-auto">
      <section className="mx-auto flex flex-col items-center justify-center min-h-[90vh]">
        <h1 className="text-[3em] md:text-[4em] lg:text-[7em] flex flex-col gap-5 text-center font-bold font-neueMachinaBold text-balance md:leading-[auto] lg:leading-tight text-black">
          <span className="bg-orange-400 lg:pt-5 px-2 leading-tight">
            Hackathon's
          </span>{" "}
          <span>
            <span className="bg-fuchsia-500 pt-5 px-2">Starter</span>{" "}
            <span className="bg-fuchsia-500 pt-5 px-2">Kits</span>
          </span>
        </h1>
        <p className="text-[1.5em] md:text-[2em] mt-4 text-center font-bold">
          An introduction for building dApps on Bitcoin
        </p>
        <Scanner
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
          onScan={(result) => {
            console.log(result, 'result');
            if (result[0]) {
              const scannedData = result[0]?.rawValue;
              // @ts-ignore
              setData(scannedData);
              parseQRCodeData(scannedData);
            }
        }}></Scanner>
        <div className="flex gap-5">
          <Button className="mt-10 mx-auto flex gap-2">
            <Github /> See code
          </Button>
          <Button className="mt-10 mx-auto" onClick={scrollToTabs}>
            See more
          </Button>
        </div>
      </section>

      <div className="my-10">
        <InfiniteScroll />
      </div>

      <div className="my-40">
        <Starters />
      </div>
    </main>
  );
}
