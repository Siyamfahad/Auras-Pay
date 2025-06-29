import "@/assets/styles/globals.scss";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import chroma from "chroma-js";
import * as Themes from "@/theme/Theme.Colors";
import ThemeConfig from "../theme/Theme.Config";
import ThemeProvider from "@/common/contexts/ThemeProvider";
import { useCallback, useMemo } from "react";
import Head from "next/head";

/**
 * Bootstrap NEXT.JS App
 * @param {AppProps} { Component, pageProps }
 * @returns {JSX.Element} JSX.Element
 * @description This is the main bootstrap for the application. It loads the font and the theme.
 */

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const ThemeMainColor = useMemo(
    () => Themes[ThemeConfig.theme as keyof typeof Themes].main,
    []
  );

  const Delta = useMemo(
    () => chroma.deltaE(ThemeMainColor, "#ffffff"),
    [ThemeMainColor]
  );

  const TextColor = useCallback(() => {
    if (Delta < 35) {
      return "#000000";
    } else {
      return "#ffffff";
    }
  }, [Delta]);

  return (
    <>
      <Head>
        <title>AURAS Wallet - Secure Solana Crypto Wallet | Lightning Fast Transactions</title>
        <meta name="description" content="Experience the power of Solana with AURAS Wallet. Store, send, and manage SOL, USDT, and SPL tokens with military-grade security. Complete control over your keys, instant QR payments, and seamless DeFi integration." />
        <meta name="keywords" content="Solana wallet, crypto wallet, SOL, USDT, SPL tokens, DeFi, non-custodial, QR payments, staking, Solana blockchain, cryptocurrency" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="AURAS Wallet - Your Gateway to the Solana Ecosystem" />
        <meta property="og:description" content="The most secure and fastest Solana wallet. Non-custodial, cross-platform, with QR payments and DeFi integration." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://auraswallet.com" />
        <meta property="og:image" content="https://auraswallet.com/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AURASWallet" />
        <meta name="twitter:title" content="AURAS Wallet - Solana Crypto Wallet" />
        <meta name="twitter:description" content="The most secure and fastest Solana wallet for SOL, USDT, and SPL tokens." />
        <meta name="twitter:image" content="https://auraswallet.com/images/og-image.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#8B5CF6" />
      </Head>
    <ThemeProvider>
      <style jsx global>{`
        :root {
          --main-color: ${ThemeMainColor};
          --main-text-color: ${TextColor()};
          --main-color-lighter: ${chroma(ThemeMainColor).brighten(1).hex()};
          --main-color-darker: ${chroma(ThemeMainColor).darken(0.5).hex()};
        }
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </ThemeProvider>
    </>
  );
}
