import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client"

const network = (process.env.NEXT_PUBLIC_NETWORK || "testnet") as "testnet" | "mainnet"

export const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
})

export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || ""
export const GAME_OBJECT_ID = process.env.NEXT_PUBLIC_GAME_OBJECT_ID || ""
