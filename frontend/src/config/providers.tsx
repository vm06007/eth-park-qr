import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { type ReactNode, useState } from 'react';
import { type State } from 'wagmi';
import { mainnet, polygon } from "wagmi/chains";
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { toPrivyWallet } from '@privy-io/cross-app-connect';

function getConfig() {

  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Partners',
        wallets: [
          toPrivyWallet({
            id: import.meta.env.VITE_PRIVY_PROJECT_ID,
            name: 'ETHPark-QR',
            iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAADKCAMAAAC7SK2iAAAAtFBMVEX///8BAf//GwL//v////4AAPv///z8xLn/+vb3CgDkkoYAAN6mpvDj4P3gLhv9HAEAAOv1kYnwEgDb29u6urrOzs719fXh4eHu7u6UlJS/v7/R0dHn5+fX19fExMSkpKSBgYH29PZaWlp5eXpsbW1iYmKxsbKGiIZVUlTHxcfo5uiKh4uenJ93dHfh3+Ksqq0AAAApJSowMDFISEiusa5XWVaUl5RhZGGdn50yNTFQU1A8PDyciDMFAAAE1UlEQVR4nO2diXarNhCGpxahe3NbhCR2sFhix0t7s7nt+79XhcE2XtI4N06Uc2a+CKNlRp4fCeUcBytwPRpdX3epza5PXdoc27ZTZqPrI7NTbaNd22jXdqZZZ/ly2zbsoYLnzWCEFpKOEZKOEZKOEZKOEZKOEZKOEZKOEZKOEZKOEZKOEczSr9GCedRtB2APko4R+A0t8D1a4Ae0AGIYWsBFC2bpBEEQBEEQBEEQBEEQBEEQxEfhuK7THl1y9gvuqcI5Nm/t9CMcMH8Ob/vPP/bALB3MpG+PLu1yZxbexeEbOn3Z+8gGutvfOVoLjquPC+fYvNrB+VaH10YBv6AFvqAFrtAC36EFs3Tb084eZtSvunS1ze0VrvYLJ23e6vAunb7ogHnC2w7AHiQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdIyQdE4OvAmBjK93Oly8+AwhHfQPmUbcdgD3gZ7TAr2ixvVWGTWzvGPHxdLrbXQsIgiAIgiAIgiAIgiAIgiAI4r2x/am4PaDbVReOttg9rn61zQc5vKbToQNmmOM4bJB2ufYKPVM4x+G0zbkO4JqhctvU5vrCvsOrwm67GnTaFj4tzvbUT8+3xbrXD0142+usPTBL/x0t8AdaYIQWko4Rko4Rko4Rko4Rko4Rko4Rko4Rko4Rko4Rko4Rko4Rko4RzNJ/RAv8hBZw0GL7yQabXOQC7v7JeZ/fVLht0XG7H7fL9cXhy9qh999v7Bs2PTvbt3h70Bd8qkIM8s5ei3NgI44d+qu1fsClfXE2TuvCusK8dE8+XSheYBcCpjd9X4VXFIth00Jtcmub4pkeCp9BwhNQfMKKSaiATQo27Qss4guAZMomNQ8vFPGFugGYVu39Y3LFLSxmMNgPYZZscmubw60Suiggnt+waVnPF/lScx4sb4vgz4LN69uwni2DxTycTyd/1Sya1HfFRaK+0IpRj1fxWN/IRnpB/lXrr43UpR+Nq8m4jO/uQj6upFeWvFRaAsiy8k2Nl5XlbBwAiNiISeQY6gBmdQRhwLNUq3QeQ5kEyzoLc0/LyuO8Nu8VLi+00US3Fu3SM4X/tXHc/F7FD2KVGem5ysF7hDxvdFrCfRPDY6Ke3FQ/pq73oH1wobl3o7ZmxZNSPElQf8ftTf3gyqfVPx4ILbluVi5oJZrmKTGFTJaPWkF4b7yf4t0S8pawL3H1DIo3soLlqollHmsnCYTmUvkNiLQUQeSV4FW5B6pqQmNt9Lc1ZebHDZTScWLRdjI2/QRmEhgb7Tk6Bi2SypjlnsiDDFYcUjPqPNg85fs54GkZjSGbZatAqyr0Sp8HPI1ySHkVZ42X101d57yuhJn4gpubOa/zOkhlDpVsO2Cg/H994Zcg5tqPsiArRXRTy5Lnq2yV6cmcV4lscqnGwrbYPZjHPeGDlCr0TSZlqc9SHqsEYp5CHMbKnEQaxj4kcaSYz5WpYZ4SCfiiW/lizkORmNkfhtwXxhtCzmPjL1pH8M3aH3Eeqci22DM5sRydXqHYfhs7bNscz7hbpY+rC5GtM9tfIKxvANidWF850DMwOc4edvT5OBidXaQD8YcC2IlR7nN7phcW/R/JMesGpv2KrwAAAABJRU5ErkJggg==',
          }),
        ],
      },
    ],
    {
      appName: 'ETHPark',
      projectId: import.meta.env.VITE_PRIVY_PROVIDER_APP_ID,
    },
  );

  return createConfig({
    chains: [base, mainnet, polygon],
    connectors: [
      coinbaseWallet({
        appName: 'OnchainKit',
        preference: 'smartWalletOnly',
        version: '4',
      }),
      ...connectors,
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [base.id]: http(),
    },
  });
}

function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#f28a0e",
          accentColorForeground: "black",
        })}
      >
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
          // @ts-ignore
          chain={base}
        >
          {props.children}
        </OnchainKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
