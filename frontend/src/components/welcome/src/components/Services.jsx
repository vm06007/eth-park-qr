import Section from "./Sections";
import Heading from "./Heading";
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { gradient } from '../assets';
import { PaymentHandler } from "./logic/Services";
import { Scanner } from '@yudiel/react-qr-scanner';

const Services = () => {

  const [data, setData] = useState(null);
  const [scan, setScan] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleError = (err) => {
    console.error(err);
    alert('must allow camera access to scan QR code');
  };

  const sendCodeToAPI = async (code) => {
    try {
      const response = await fetch("/api/Home/SaveProduct1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          { X: code }
        ),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error("API request failed:", error);
      setApiResponse({ error: "Failed to send code to API" });
    }
  };

  const parseQRCodeData = (url) => {

    if (!url.includes("http")) {
      console.log(url, 'data scanned');
      console.info("Not a link");
      return;
    }

    try {
      console.log(url, 'url');
      const urlObj = new URL(url);
      const extracted = urlObj.searchParams.get("data");

      if (extracted) {
        setScan(extracted);
        sendCodeToAPI(extracted);
      }
    } catch (error) {
      console.info("Invalid URL format:", error);
    }
  };

  return (
    <Section crosses id="try-it-now">
      <div className="container">
        <Heading
          title="See How It Works"
          text="Scan QR parking ticket and pay with crypto"
        />

        <div className="relative">
          <div className="relative z-1 grid gap-5 lg:grid-cols-2">
            <div style={{height: "630px"}} className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
              </div>
              <div style={{filter: "hue-rotate(-45deg)"}}>
              <div style={{opacity: "0.8", filter: "contrast(1.2) brightness(0.8)"}}>
              <Scanner
                onError={handleError}
                constraints={{ facingMode: 'environment' }}
                onScan={(result) => {
                  console.log(result, 'result');
                  if (result[0]) {
                    const scannedData = result[0]?.rawValue;
                    setData(scannedData);
                    parseQRCodeData(scannedData);
                  }
              }}></Scanner>
              </div>
              </div>
              <div  className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-[#00111133] to-[#001520FF] from-n-8/0 to-n-8/90 lg:p-15">
              {!data && (<>
                <h4 className="h4 mb-4 pl-2">1. Place QR Here</h4>
                <p className="body-2 pb-[0rem] pr-2 pl-2 mb-[1rem] text-n-3">
                  If you have a QR code, scan it here, this will query
                  parking status and outstanding payment balance
                </p>
                </>)}
                {data && (
          <div className="flex flex-col items-center space-y-2">
            <p className="font-bold text-center">Scanned QR Code:</p>
            <p className="text-center"><a className="underline" href={`${data}`} target="_blank">{data}</a></p>
            <div style={{filter: "drop-shadow(2px 4px 6px black)"}}>
              <QRCode value={data} />
            </div>
            {scan && (
              <div>
                <p className="text-center font-bold mt-3">Extracted ID:</p>
                <p className="text-center">{scan}</p>
              </div>
            )}
            </div>
            )}
            </div>
            </div>
            <div className="p-4 bg-n-7 rounded-3xl overflow-hidden lg:min-h-[36rem]">
              <div className="py-2 px-4 xl:px-2">
              {!data && (<>
                <h4 className="h4 mb-4">...</h4>
                <p className="body-2 mb-[2rem] text-n-3">
                  Here you will see details about your parking status
                </p>
                </>)}
                {data && (<>
                <h4 className="h4 mb-2">2. Review And Pay</h4>
                <p className="body-2 mb-[2rem] text-n-3">
                  Now you can settle your parking fee with crypto
                </p>
                </>)}
                <div className="relative h-[20rem] bg-n-8 rounded-xl overflow-hidden md:h-[29rem]">
                  <PaymentHandler scan={scan} data={data} api={apiResponse} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 -left-[10rem] w-[56.625rem] h-[56.625rem] opacity-50 mix-blend-color-dodge pointer-events-none">
            <img
              className="absolute top-1/2 left-1/2 w-[79.5625rem] max-w-[79.5625rem] h-[88.5625rem] -translate-x-1/2 -translate-y-1/2"
              src={gradient}
              width={1417}
              height={1417}
              alt="Gradient"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
