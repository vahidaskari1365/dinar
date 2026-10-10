import { Navbar } from "@/components/landing/navbar";
import { Preloader } from "@/components/landing/preloader";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { Hero } from "@/components/landing/hero";
import { MarketTicker } from "@/components/landing/market-ticker";
import { FeaturesBento } from "@/components/landing/bento";
import { GoldVault } from "@/components/landing/gold-vault";
import { LicenseRoadmap } from "@/components/landing/roadmap";
import { Feasibility, Faq } from "@/components/landing/feasibility";
import { WalletDemo } from "@/components/wallet/wallet-demo";
import { CtaBanner } from "@/components/landing/cta";
import { Consultation } from "@/components/landing/consultation";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarketTicker />
        <FeaturesBento />
        <GoldVault />
        <WalletDemo />
        <LicenseRoadmap />
        <Feasibility />
        <Faq />
        <CtaBanner />
        <Consultation />
      </main>
      <Footer />
    </div>
  );
}
