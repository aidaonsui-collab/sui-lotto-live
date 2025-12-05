# The Playground - Complete Deployment Guide for Beginners

This guide will walk you through deploying "The Playground" blockchain game from scratch, even if you've never coded before.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installing Required Software](#installing-required-software)
3. [Setting Up Your Development Environment](#setting-up-your-development-environment)
4. [Deploying Smart Contracts](#deploying-smart-contracts)
5. [Setting Up the Website](#setting-up-the-website)
6. [Going Live](#going-live)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, you'll need:
- A computer (Windows, Mac, or Linux)
- Internet connection
- About 2-3 hours of time
- Basic ability to follow instructions

---

## Installing Required Software

### Step 1: Install Node.js

Node.js is a platform that lets you run JavaScript code on your computer.

1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the prompts
4. Click "Next" through all the steps, using default settings

**Verify Installation:**
1. Open Terminal (Mac/Linux) or Command Prompt (Windows)
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
2. Type: `node --version`
3. You should see something like `v20.11.0`
4. Type: `npm --version`
5. You should see something like `10.2.4`

### Step 2: Install Git

Git helps you download and manage code.

1. Go to https://git-scm.com/downloads
2. Download the version for your operating system
3. Run the installer with default settings

**Verify Installation:**
1. Open Terminal/Command Prompt
2. Type: `git --version`
3. You should see something like `git version 2.43.0`

### Step 3: Install Sui CLI

The Sui CLI (Command Line Interface) lets you interact with the Sui blockchain.

**For Mac/Linux:**
\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
\`\`\`

**For Windows:**
1. Download Rust from https://rustup.rs/
2. Run the installer
3. Open Command Prompt and run:
\`\`\`bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
\`\`\`

**Verify Installation:**
\`\`\`bash
sui --version
\`\`\`

### Step 4: Install VS Code (Optional but Recommended)

VS Code is a code editor that makes viewing and editing code easier.

1. Go to https://code.visualstudio.com/
2. Download and install
3. Open VS Code after installation

---

## Setting Up Your Development Environment

### Step 1: Create a Sui Wallet

1. Install Sui Wallet browser extension:
   - Go to https://chrome.google.com/webstore
   - Search for "Sui Wallet"
   - Click "Add to Chrome"
   
2. Create a new wallet:
   - Click the Sui Wallet icon in your browser
   - Click "Create a New Wallet"
   - **IMPORTANT**: Write down your recovery phrase on paper
   - Store it in a safe place - you'll need it to recover your wallet
   - Create a password
   
3. Get Testnet SUI (for testing):
   - Switch to Testnet in your wallet (top right dropdown)
   - Go to https://discord.gg/sui
   - Join the #testnet-faucet channel
   - Type: `!faucet YOUR_WALLET_ADDRESS`
   - You'll receive free testnet SUI tokens

### Step 2: Set Up Sui CLI Configuration

1. Open Terminal/Command Prompt
2. Run: `sui client`
3. When prompted, select "Yes" to create a new configuration
4. Choose "testnet" as the network
5. Import your wallet:
\`\`\`bash
sui keytool import "YOUR_RECOVERY_PHRASE" ed25519
\`\`\`

---

## Deploying Smart Contracts

### Step 1: Prepare Your Contract

1. Navigate to the contracts folder:
\`\`\`bash
cd contracts/playground
\`\`\`

2. Build the contract:
\`\`\`bash
sui move build
\`\`\`

This will check your code for errors. If successful, you'll see "Build Successful".

### Step 2: Deploy to Testnet

1. Deploy the contract:
\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`

2. **IMPORTANT**: After deployment, you'll see output with several IDs. Save these:
   - **Package ID**: Starts with `0x...` - this is your deployed contract
   - **Game Object ID**: Another `0x...` - this is your game state
   
3. Copy these IDs to a text file - you'll need them later!

### Step 3: Test Your Contract

1. View your published contract:
\`\`\`bash
sui client object YOUR_PACKAGE_ID
\`\`\`

2. Try placing a test bet:
\`\`\`bash
sui client call --package YOUR_PACKAGE_ID --module game --function place_bet --args YOUR_GAME_OBJECT_ID COIN_OBJECT_ID "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]" --gas-budget 10000000
\`\`\`

---

## Setting Up the Website

### Step 1: Download the Project

1. Open Terminal/Command Prompt
2. Navigate to where you want to store the project:
\`\`\`bash
cd Desktop
\`\`\`

3. Clone this repository (or download the files):
\`\`\`bash
git clone YOUR_REPOSITORY_URL
cd the-playground
\`\`\`

### Step 2: Install Dependencies

1. Install required packages:
\`\`\`bash
npm install
\`\`\`

This might take 2-5 minutes. It's downloading all the libraries the website needs.

### Step 3: Configure the Website

1. Create a `.env.local` file in the root folder
2. Add your contract information:
\`\`\`
NEXT_PUBLIC_PACKAGE_ID=YOUR_PACKAGE_ID_FROM_DEPLOYMENT
NEXT_PUBLIC_GAME_OBJECT_ID=YOUR_GAME_OBJECT_ID_FROM_DEPLOYMENT
NEXT_PUBLIC_NETWORK=testnet
\`\`\`

### Step 4: Run Locally

1. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

2. Open your browser and go to:
\`\`\`
http://localhost:3000
\`\`\`

3. You should see your game! Try connecting your wallet and testing.

---

## Going Live

### Step 1: Deploy to Mainnet

**WARNING**: Make sure everything works on testnet first! Mainnet uses real money.

1. Switch Sui CLI to mainnet:
\`\`\`bash
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443
sui client switch --env mainnet
\`\`\`

2. Get real SUI tokens:
   - Buy SUI from an exchange (Coinbase, Binance, etc.)
   - Send to your wallet address
   
3. Deploy to mainnet (same commands as testnet):
\`\`\`bash
cd contracts/playground
sui move build
sui client publish --gas-budget 100000000
\`\`\`

4. Save your new mainnet Package ID and Game Object ID

### Step 2: Deploy Website to Vercel

Vercel is a platform that hosts websites for free.

1. Go to https://vercel.com/
2. Sign up with GitHub, GitLab, or email
3. Click "Add New Project"
4. Import your repository
5. Configure environment variables:
   - Add `NEXT_PUBLIC_PACKAGE_ID` with your mainnet package ID
   - Add `NEXT_PUBLIC_GAME_OBJECT_ID` with your mainnet game object ID
   - Add `NEXT_PUBLIC_NETWORK` set to `mainnet`
6. Click "Deploy"

Your website will be live at: `https://your-project-name.vercel.app`

### Step 3: Set Up Automated Game Draws

Games need to be drawn every 5 minutes, and jackpots 4 times per day. You'll need to automate this.

**Option A: Use a Server (Recommended)**

1. Rent a small VPS (Virtual Private Server) from:
   - Digital Ocean ($5/month)
   - AWS EC2 (free tier available)
   - Linode ($5/month)

2. Set up a cron job to call the draw functions:

Create a file `draw_game.sh`:
\`\`\`bash
#!/bin/bash
sui client call --package YOUR_PACKAGE_ID --module game --function draw_game --args YOUR_GAME_OBJECT_ID 0x8 --gas-budget 10000000
\`\`\`

Add to crontab (runs every 5 minutes):
\`\`\`bash
crontab -e
*/5 * * * * /path/to/draw_game.sh
\`\`\`

For jackpot (runs 4 times per day at 6AM, 12PM, 6PM, 12AM):
\`\`\`bash
0 6,12,18,0 * * * sui client call --package YOUR_PACKAGE_ID --module game --function draw_jackpot --args YOUR_GAME_OBJECT_ID 0x8 --gas-budget 10000000
\`\`\`

**Option B: Use GitHub Actions (Simpler but less reliable)**

Create `.github/workflows/draw_game.yml`:
\`\`\`yaml
name: Draw Game
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
jobs:
  draw:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Sui
        run: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
      - name: Draw Game
        run: |
          sui client call --package ${{ secrets.PACKAGE_ID }} --module game --function draw_game --args ${{ secrets.GAME_OBJECT_ID }} 0x8 --gas-budget 10000000
\`\`\`

---

## Connecting Your Wallet to the Website

### For Users:

1. Install Sui Wallet extension from Chrome Web Store
2. Create or import your wallet
3. Visit your game website
4. Click "Connect Wallet"
5. Approve the connection
6. You can now play!

### Supported Wallets:

- **Sui Wallet**: Primary wallet (fully integrated)
- **Phantom Wallet**: Coming soon (code prepared but needs implementation)

---

## Troubleshooting

### Common Issues:

**"Command not found" errors:**
- Make sure you installed Node.js, Git, and Sui CLI correctly
- Try closing and reopening your terminal
- Check if the program is in your PATH

**"Insufficient gas" errors:**
- You need more SUI tokens in your wallet
- For testnet: Request from faucet again
- For mainnet: Buy more SUI

**Website won't connect to wallet:**
- Make sure Sui Wallet extension is installed
- Check that you're on the correct network (testnet vs mainnet)
- Try refreshing the page
- Check browser console for errors (F12 → Console tab)

**Contract deployment fails:**
- Check your Move.toml file has correct dependencies
- Make sure you have enough SUI for gas
- Verify your code compiles: `sui move build`

**Numbers won't select on game board:**
- Make sure wallet is connected
- Check browser console for JavaScript errors
- Try hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

**Transactions fail:**
- Check you have enough SUI for both bet and gas
- Verify contract IDs in .env.local are correct
- Check Sui network status: https://status.sui.io

### Getting Help:

1. **Sui Discord**: https://discord.gg/sui
   - #developer-questions channel
   - Very active and helpful community

2. **Sui Documentation**: https://docs.sui.io
   - Comprehensive guides and API references

3. **GitHub Issues**: Create an issue in this repository

4. **Sui Forums**: https://forums.sui.io
   - Great for longer technical discussions

---

## Maintaining Your Game

### Daily Tasks:
- Check that automated draws are working
- Monitor the jackpot balance
- Review transactions for any issues

### Weekly Tasks:
- Check wallet balance (for gas fees)
- Review leaderboard data
- Update content if needed

### Monthly Tasks:
- Review server costs
- Check for Sui platform updates
- Backup important data

---

## Security Best Practices

1. **Never share your recovery phrase**
2. **Never commit private keys to Git**
3. **Use environment variables for sensitive data**
4. **Test everything on testnet first**
5. **Keep your server secure (if using one)**
6. **Regularly update dependencies**: `npm update`
7. **Monitor your smart contract for suspicious activity**
8. **Set up alerts for large transactions**

---

## Costs Breakdown

### One-Time Costs:
- Domain name (optional): $10-15/year
- Smart contract deployment: ~1-5 SUI (~$2-10)

### Ongoing Costs:
- Server for automation: $5/month (optional)
- Gas fees for draws: ~0.01 SUI per draw = ~$0.02/month
- Vercel hosting: Free (Pro plan $20/month for custom features)

### Revenue:
- 3% of all winning payouts automatically sent to your wallet
- With 100 players at 0.05 SUI average bet = 5 SUI total pool
- Your fee per game: ~0.15 SUI
- 288 games per day = 43.2 SUI/day potential revenue

---

## Next Steps

After deployment, consider:

1. **Marketing**: 
   - Share on Sui Discord
   - Post on crypto Twitter
   - List on DApp directories

2. **Improvements**:
   - Add more game modes
   - Create mobile app version
   - Implement referral system
   - Add achievement badges

3. **Monitoring**:
   - Set up analytics (Google Analytics)
   - Track player retention
   - Monitor smart contract events

4. **Community**:
   - Create Discord server
   - Engage with players
   - Host tournaments

---

## Legal Disclaimer

**IMPORTANT**: Online gambling may be regulated or prohibited in your jurisdiction. This guide is for educational purposes only. You are responsible for:

- Complying with local gambling laws
- Obtaining necessary licenses
- Paying applicable taxes
- Implementing age verification
- Providing responsible gambling resources

Consult with a lawyer before launching a real-money gambling platform.

---

## Support

If you need help or have questions:
- Open an issue on GitHub
- Join our Discord community
- Email: support@theplayground.game

Good luck with your blockchain game! 🎮🚀
