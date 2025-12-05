export const CONTRACT_CONFIG = {
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID!,
  GAME_OBJECT_ID: process.env.NEXT_PUBLIC_GAME_OBJECT_ID!,
  MODULE_NAME: "game" as const,        // ← THIS WAS MISSING
  NETWORK: (process.env.NEXT_PUBLIC_NETWORK || "testnet") as "mainnet" | "testnet",
}

export const isContractConfigured =
  !!CONTRACT_CONFIG.PACKAGE_ID &&
  !!CONTRACT_CONFIG.GAME_OBJECT_ID &&
  CONTRACT_CONFIG.PACKAGE_ID.startsWith("0x") &&
  CONTRACT_CONFIG.GAME_OBJECT_ID.startsWith("0x")
