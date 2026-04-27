import * as React from "react";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "@/src/components/sections/Navbar";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { TrustBadges } from "@/src/components/sections/TrustBadges";
import { WhyJoinSection } from "@/src/components/sections/WhyJoinSection";
import { ProductsSection } from "@/src/components/sections/ProductsSection";
import { HowItWorksSection } from "@/src/components/sections/HowItWorksSection";
import { DeliverySection } from "@/src/components/sections/DeliverySection";
import { WhatsAppJoinSection } from "@/src/components/sections/WhatsAppJoinSection";
import { WhoCanJoinSection } from "@/src/components/sections/WhoCanJoinSection";
import { TestimonialsSection } from "@/src/components/sections/TestimonialsSection";
import { FinalCTABanner } from "@/src/components/sections/FinalCTABanner";
import { SignUpForm } from "@/src/components/sections/SignUpForm";
import { AppDownloadsSection } from "@/src/components/sections/AppDownloadsSection";
import { Footer } from "@/src/components/sections/Footer";
import { FloatingWhatsApp } from "@/src/components/FloatingWhatsApp";
import { StickyCTABar } from "@/src/components/StickyCTABar";
import { Toaster } from "sonner";
import { SiteContentProvider } from "@/src/providers/SiteContentProvider";

export default function App() {
  return (
    <SiteContentProvider>
      <div className="min-h-screen bg-white bg-line-pattern">
        <Navbar />
        <main>
          <HeroSection />
          <TrustBadges />
          <ProductsSection />
          <WhyJoinSection />
          <HowItWorksSection />
          <DeliverySection />
          <WhoCanJoinSection />
          <WhatsAppJoinSection />
          <TestimonialsSection />
          <FinalCTABanner />
          <SignUpForm />
          <AppDownloadsSection />
        </main>
        <Footer />

        <FloatingWhatsApp />
        <StickyCTABar />
        <Toaster position="top-center" richColors />
      </div>
    </SiteContentProvider>
  );
}
