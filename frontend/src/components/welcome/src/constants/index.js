import {
  layer0,
  telegram,
  twitter,
  chainlink,
  privy,
  loading,
  coinbase,
  bitkub,
} from "../../src/assets";

import { check } from "../assets";

export const navigation = [
  {
    id: "0",
    title: "See How It Works",
    url: "#try-it-now",
  },
  {
    id: "1",
    title: "Latest Payments",
    url: "#latest-payments",
  }
];

export const logos = [
  chainlink,
  layer0,
  bitkub,
  privy,
  coinbase,
];

export const socials = [
  {
    id: "0",
    title: "Twitter",
    iconUrl: twitter,
    url: "https://x.com/EthVitally",
  },
  {
    id: "1",
    title: "Telegram",
    iconUrl: telegram,
    url: "https://t.me/EthVitally",
  },
];


export const venues = [
  {
    id: "1",
    title: "EmSphere Mall",
    text: "Great place to shop and eat with friends and family",
    backgroundUrl: "assets/benefits/card-2.svg",
    iconUrl: check,
    light: true,
    imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/3a/24/f5/emsphere-outside-view.jpg?w=1200&h=-1&s=1",
    // light: true,
  },
  {
    id: "2",
    title: "EmQuartier Mall",
    text: "Perfect knowledge base for your shopping needs",
    backgroundUrl: "assets/benefits/card-3.svg",
    iconUrl: check,
    light: true,
    imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/d9/a3/57/the-emquartier.jpg?w=1200&h=-1&s=1",
  },
  {
    id: "0",
    title: "QSNCC Venue",
    text: "Come here for DevCon, ETHGlobal and many other events",
    backgroundUrl: "assets/benefits/card-1.svg",
    iconUrl: loading,
    imageUrl: "https://images.prismic.io/qsncc/a37e7c8c-0b3a-4d81-8c50-1382c38f7a33_Thumbnail_Virtual.jpg?auto=compress,format",
  },
  {
    id: "4",
    title: "Central Rama 9",
    text: "Easy to reach for night markets and shopping enthusiasts",
    backgroundUrl: "assets/benefits/card-5.svg",
    iconUrl: loading,
    // imageUrl: "https://image-tc.galaxy.tf/wijpeg-2inif3jihrgb67nox851s2b9q/central-plaza-rama-9_standard.jpg?crop=240%2C0%2C1440%2C1080",
    imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/05/86/f1/centralplaza-grand-rama9.jpg?w=1200&h=-1&s=1",
  },
  {
    id: "3",
    title: "Suvarnabhumi Airport",
    text: "World class airport with many amenities and connecting routes",
    backgroundUrl: "assets/benefits/card-4.svg",
    iconUrl: loading,
    imageUrl: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2024/07/24093024/bk-airport.jpeg",
    //light: true,
  },
  {
    id: "5",
    title: "One Bangkok Area",
    text: "One of the largest mixed-use developments in Bangkok",
    backgroundUrl: "assets/benefits/card-6.svg",
    iconUrl: loading,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/One_Bangkok_from_Witthayu_Junction_%282024-10-26%29_03.jpg/1200px-One_Bangkok_from_Witthayu_Junction_%282024-10-26%29_03.jpg",
  },
];