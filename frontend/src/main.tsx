import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Providers from "./config/providers";
import { PrivyProvider } from '@privy-io/react-auth';
import "./polyfills";
import "@rainbow-me/rainbowkit/styles.css";
import '@coinbase/onchainkit/styles.css';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_PROVIDER_APP_ID}
      config={{
      "appearance": {
        "accentColor": "#6A6FF5",
        "theme": "#FFFFFF",
        "showWalletLoginFirst": false,
        "logo": "https://auth.privy.io/logos/privy-logo.png",
        "walletChainType": "ethereum-only",
        "walletList": [
          "detected_ethereum_wallets"
        ]
      },
      "loginMethods": [
        "email",
        "wallet",
        "google",
        "apple",
        "github"
      ],
      "fundingMethodConfig": {
        "moonpay": {
          "useSandbox": false
        }
      },
      "embeddedWallets": {
        "createOnLogin": "users-without-wallets",
        "requireUserPasswordOnCreate": false
      },
      "mfa": {
        "noPromptOnMfaRequired": true
      }
    }}
    >
      <Providers>
        <App />
      </Providers>
    </PrivyProvider>
  </React.StrictMode>
);
