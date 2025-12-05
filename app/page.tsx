"use client"

import { useState } from "react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { GameBoard } from "@/components/game-board"
import { JackpotTicker } from "@/components/jackpot-ticker"
import { Leaderboard } from "@/components/leaderboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PlaygroundPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentWallet, setCurrentWallet] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              THE <span className="text-destructive">PLAYGROUND</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <WalletConnectButton
              onConnect={(wallet) => {
                setIsConnected(true)
                setCurrentWallet(wallet)
              }}
              onDisconnect={() => {
                setIsConnected(false)
                setCurrentWallet(null)
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Jackpot Ticker */}
        <JackpotTicker />

        {/* Alert for connection */}
        {!isConnected && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Connect your wallet to start playing. Minimum bet: 0.05 SUI</AlertDescription>
          </Alert>
        )}

        {/* Game Board */}
        <div className="mb-8">
          <GameBoard isConnected={isConnected} walletAddress={currentWallet} />
        </div>

        {/* Leaderboard */}
        <Leaderboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built on Sui Blockchain • Games run every 5 minutes • Jackpot drawn 4x daily</p>
          <p className="mt-2 text-xs opacity-60">Play responsibly. May the odds be in your favor.</p>
        </div>
      </footer>
    </div>
  )
}
