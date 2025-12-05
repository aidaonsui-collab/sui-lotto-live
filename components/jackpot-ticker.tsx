"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Coins } from "lucide-react"

export function JackpotTicker() {
  const [jackpotAmount, setJackpotAmount] = useState(1234.56)

  useEffect(() => {
    // Simulate jackpot growth
    const jackpotInterval = setInterval(() => {
      setJackpotAmount((prev) => prev + Math.random() * 0.5)
    }, 5000)

    return () => {
      clearInterval(jackpotInterval)
    }
  }, [])

  return (
    <Card className="mb-6 p-8 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border-amber-500/30 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

      {/* Piggy bank visual */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
        <div className="relative">
          {/* Piggy bank body */}
          <div className="w-32 h-24 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full relative">
            {/* Coin slot */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-amber-600 rounded-full" />
            {/* Snout */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full" />
            {/* Eye */}
            <div className="absolute right-6 top-6 w-2 h-2 bg-amber-800 rounded-full" />
            {/* Leg */}
            <div className="absolute bottom-0 left-6 w-4 h-6 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-lg" />
            <div className="absolute bottom-0 right-6 w-4 h-6 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-lg" />
          </div>
          {/* Floating coins */}
          <Coins className="absolute -top-4 -left-4 h-8 w-8 text-yellow-400 animate-bounce" />
        </div>
      </div>

      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/30 rounded-full backdrop-blur-sm">
            <Coins className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Random Jackpot Pool</p>
            <p className="text-5xl font-bold font-mono bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              {jackpotAmount.toFixed(2)} SUI
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/80 ml-14 italic">
          Drawn at random times throughout the day to prevent manipulation
        </p>
      </div>
    </Card>
  )
}
