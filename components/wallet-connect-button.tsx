"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@suiet/wallet-kit"
import { useEffect } from "react"

interface WalletConnectButtonProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export function WalletConnectButton({ onConnect, onDisconnect }: WalletConnectButtonProps) {
  const { connected, address, connecting, select, disconnect, configuredWallets } = useWallet()
  const { toast } = useToast()

  useEffect(() => {
    if (connected && address) {
      onConnect(address)
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    }
  }, [connected, address])

  const handleConnect = (walletName: string) => {
    try {
      select(walletName)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      onDisconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  if (connected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 font-mono bg-transparent">
            <Wallet className="h-4 w-4" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="gap-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
          disabled={connecting}
        >
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {configuredWallets.map((wallet) => (
          <DropdownMenuItem key={wallet.name} onClick={() => handleConnect(wallet.name)}>
            {wallet.name}
          </DropdownMenuItem>
        ))}
        {configuredWallets.length === 0 && <DropdownMenuItem disabled>No wallets detected</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
