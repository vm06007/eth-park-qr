// import { rsktestnet } from "@/lib/utils/RootstockTestnet";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon } from "wagmi/chains";

export const rainbowkitConfig = getDefaultConfig({
  appName: "Rootstock Rainbowkit",
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains: [
    mainnet,
    polygon,
    // rootstock,
    // rsktestnet
  ],
});
