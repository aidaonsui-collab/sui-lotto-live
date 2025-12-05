"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, TrendingUp, Circle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@suiet/wallet-kit"
import { Transaction } from "@mysten/sui/transactions"
import { CONTRACT_CONFIG, isContractConfigured } from "@/lib/contract-config"

interface GameBoardProps {
  isConnected: boolean
  walletAddress: string | null
}

type GameStatus = "waiting" | "active" | "drawing"

export function GameBoard({ isConnected, walletAddress }: GameBoardProps) {
  const [betAmount, setBetAmount] = useState("0.05")
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting")
  const [timeRemaining, setTimeRemaining] = useState(60) // 1 minute
  const [currentPlayers, setCurrentPlayers] = useState(0)
  const [totalPool, setTotalPool] = useState(0)
  const { toast } = useToast()
  const { signAndExecuteTransaction } = useWallet()

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Game ends, start new game
          if (gameStatus === "active") {
            setGameStatus("drawing")
            drawWinningNumbers()
          }
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStatus])

  const drawWinningNumbers = () => {
    // Simulate drawing winning numbers
    const numbers: number[] = []
    while (numbers.length < 15) {
      const num = Math.floor(Math.random() * 25) + 1
      if (!numbers.includes(num)) {
        numbers.push(num)
      }
    }
    setDrawnNumbers(numbers)

    setTimeout(() => {
      checkWinner(numbers)
      setGameStatus("waiting")
      setSelectedNumbers([])
      setDrawnNumbers([])
    }, 3000)
  }

  const checkWinner = (drawn: number[]) => {
    if (selectedNumbers.length === 0) return

    const matches = selectedNumbers.filter((num) => drawn.includes(num)).length

    if (matches >= 6) {
      toast({
        title: "WINNER!",
        description: `You matched ${matches} numbers! Payout incoming...`,
      })
    } else {
      toast({
        title: "Better luck next time",
        description: `You matched ${matches} numbers. Need 6+ to win.`,
        variant: "destructive",
      })
    }
  }

  const toggleNumber = (num: number) => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to play",
        variant: "destructive",
      })
      return
    }

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num))
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num])
    }
  }

  const placeBet = async () => {
    if (!isContractConfigured()) {
      toast({
        title: "Contract Not Configured",
        description: "Please deploy the smart contract and update the configuration in .env.local",
        variant: "destructive",
      })
      return
    }

    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to play",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(betAmount)
    if (amount < CONTRACT_CONFIG.MIN_BET) {
      toast({
        title: "Invalid Bet",
        description: `Minimum bet is ${CONTRACT_CONFIG.MIN_BET} SUI`,
        variant: "destructive",
      })
      return
    }

    if (selectedNumbers.length !== 10) {
      toast({
        title: "Select Numbers",
        description: "Please select exactly 10 numbers",
        variant: "destructive",
      })
      return
    }

    try {
      // Create transaction to call smart contract
      const tx = new Transaction()

      // Convert SUI amount to MIST (1 SUI = 1,000,000,000 MIST)
      const amountInMist = Math.floor(amount * 1_000_000_000)

      // Split coin for the bet
      const [coin] = tx.splitCoins(tx.gas, [amountInMist])

      // Call the place_bet function
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::place_bet`,
        arguments: [tx.object(CONTRACT_CONFIG.GAME_OBJECT_ID), coin, tx.pure.vector("u8", selectedNumbers)],
      })

      // Execute transaction
      toast({
        title: "Processing Transaction",
        description: "Please approve the transaction in your wallet...",
      })

      const result = await signAndExecuteTransaction({
        transaction: tx,
      })

      console.log("[v0] Transaction result:", result)

      setGameStatus("active")
      setCurrentPlayers((prev) => prev + 1)
      setTotalPool((prev) => prev + amount)

      toast({
        title: "Bet Placed!",
        description: `${amount} SUI bet placed successfully. Good luck!`,
      })
    } catch (error) {
      console.error("[v0] Error placing bet:", error)
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to place bet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {!isContractConfigured() && (
        <div className="lg:col-span-3 mb-4">
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-500">Smart Contract Not Configured</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Deploy your smart contract and add the Package ID and Game Object ID to your .env.local file to enable
                real blockchain transactions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Game Info */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-destructive" />
              Game Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Time Remaining</span>
                <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
              </div>
              <Progress value={(timeRemaining / 60) * 100} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={gameStatus === "active" ? "default" : "secondary"}>
                {gameStatus === "active" ? "LIVE" : gameStatus === "drawing" ? "DRAWING" : "WAITING"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Players
              </span>
              <span className="font-bold">{currentPlayers}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Prize Pool
              </span>
              <span className="font-bold text-lg">{totalPool.toFixed(2)} SUI</span>
            </div>
          </CardContent>
        </Card>

        {/* Place Bet */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Place Your Bet</CardTitle>
            <CardDescription>Select 10 numbers and enter bet amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Bet Amount (min: {CONTRACT_CONFIG.MIN_BET} SUI)
              </label>
              <Input
                type="number"
                step="0.01"
                min={CONTRACT_CONFIG.MIN_BET}
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="font-mono"
                disabled={!isConnected}
              />
            </div>

            <div className="text-sm text-muted-foreground">Selected: {selectedNumbers.length}/10 numbers</div>

            <Button
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
              onClick={placeBet}
              disabled={!isConnected || selectedNumbers.length !== 10}
            >
              Place Bet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Number Grid */}
      <Card className="lg:col-span-2 border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Select Your Numbers</CardTitle>
          <CardDescription>Choose 10 numbers from 1-25</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedNumbers.includes(num)
              const isDrawn = drawnNumbers.includes(num)
              const isMatch = isSelected && isDrawn

              return (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  disabled={!isConnected || gameStatus === "drawing"}
                  className={`
                    aspect-square rounded-lg font-bold text-lg transition-all
                    ${isMatch ? "bg-green-500 text-white scale-110" : ""}
                    ${isSelected && !isMatch ? "bg-destructive text-white" : ""}
                    ${isDrawn && !isMatch ? "bg-yellow-500 text-black" : ""}
                    ${!isSelected && !isDrawn ? "bg-muted hover:bg-muted-foreground/20" : ""}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {num}
                </button>
              )
            })}
          </div>

          {gameStatus === "drawing" && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-center">
              <p className="font-bold text-lg">Drawing Numbers...</p>
              <div className="flex gap-2 justify-center mt-3">
                {[...Array(3)].map((_, i) => (
                  <Circle key={i} className="h-3 w-3 animate-pulse" />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
