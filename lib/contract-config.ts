// Contract configuration - Update these after deploying your contract

export const CONTRACT_CONFIG = {
  // Replace with your deployed package ID
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || "",

  // Replace with your game object ID
  GAME_OBJECT_ID: process.env.NEXT_PUBLIC_GAME_OBJECT_ID || "",

  // Sui Random object (this is standard on Sui mainnet/testnet)
  RANDOM_OBJECT_ID: "0x8",

  // Developer wallet address
  DEVELOPER_ADDRESS: "0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b",

  // Minimum bet in SUI
  MIN_BET: 0.05,
}

// Validation function to check if contract is configured
export function isContractConfigured(): boolean {
  return (
    CONTRACT_CONFIG.PACKAGE_ID !== "" &&
    CONTRACT_CONFIG.GAME_OBJECT_ID !== "" &&
    !CONTRACT_CONFIG.PACKAGE_ID.includes("YOUR_") &&
    !CONTRACT_CONFIG.GAME_OBJECT_ID.includes("your_")
  )
}

// Instructions to update after deployment:
// 1. Deploy your contract: sui client publish --gas-budget 100000000
// 2. Copy the Package ID from the output
// 3. Copy the Game object ID (the shared object)
// 4. Create .env.local file with:
//    NEXT_PUBLIC_PACKAGE_ID=0x...your_package_id
//    NEXT_PUBLIC_GAME_OBJECT_ID=0x...your_game_object_id
// 5. Restart your dev server
