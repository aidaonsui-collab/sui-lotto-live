"use client"

import type React from "react"

import { WalletProvider } from "@suiet/wallet-kit"
import "@suiet/wallet-kit/style.css"

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
