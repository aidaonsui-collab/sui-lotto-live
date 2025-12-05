"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  address: string
  plays: number
  wins: number
  losses: number
  pnl: number
}

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Generate mock leaderboard data only on client side
    const mockData: LeaderboardEntry[] = Array.from({ length: 30 }, (_, i) => ({
      rank: i + 1,
      address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      plays: Math.floor(Math.random() * 500) + 50,
      wins: Math.floor(Math.random() * 100) + 10,
      losses: Math.floor(Math.random() * 300) + 20,
      pnl: (Math.random() - 0.5) * 1000,
    })).sort((a, b) => b.pnl - a.pnl)

    setLeaderboardData(mockData)
  }, [])

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top 30 players by profit & loss</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-sm font-semibold">Rank</th>
                <th className="text-left py-3 px-2 text-sm font-semibold">Wallet</th>
                <th className="text-right py-3 px-2 text-sm font-semibold">Plays</th>
                <th className="text-right py-3 px-2 text-sm font-semibold">Wins</th>
                <th className="text-right py-3 px-2 text-sm font-semibold">Losses</th>
                <th className="text-right py-3 px-2 text-sm font-semibold">P&L (SUI)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading leaderboard...
                  </td>
                </tr>
              ) : (
                leaderboardData.map((entry) => (
                  <tr key={entry.rank} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">
                      {entry.rank <= 3 ? (
                        <Badge
                          variant={entry.rank === 1 ? "default" : entry.rank === 2 ? "secondary" : "outline"}
                          className="font-bold"
                        >
                          #{entry.rank}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 font-mono text-sm">{entry.address}</td>
                    <td className="py-3 px-2 text-right">{entry.plays}</td>
                    <td className="py-3 px-2 text-right text-green-500">{entry.wins}</td>
                    <td className="py-3 px-2 text-right text-red-500">{entry.losses}</td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`flex items-center justify-end gap-1 font-mono font-bold ${
                          entry.pnl >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {entry.pnl >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {entry.pnl >= 0 ? "+" : ""}
                        {entry.pnl.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}