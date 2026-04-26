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
import { SiteContentProvider, useSiteContent } from "@/src/providers/SiteContentProvider";
import { PageState } from "@/src/components/ui/PageState";

const AdminDashboard = React.lazy(() =>
  import("@/src/components/AdminDashboard").then((module) => ({ default: module.AdminDashboard })),
);

function LandingPage() {
  const { content, isLoading, error, retry } = useSiteContent();

  if (isLoading) {
    return <PageState title="Loading page" message="We are loading the latest marketplace content." />;
  }

  if (error) {
    return <PageState title="Page unavailable" message={error} actionLabel="Try again" onAction={() => void retry()} />;
  }

  if (!content) {
    return <PageState title="No content available" message="The landing page content is empty right now." actionLabel="Reload" onAction={() => void retry()} />;
  }

  return (
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
  );
}

export default function App() {
  const isAdminPath = typeof window !== "undefined" && window.location.pathname === "/admin-ghm-portal";

  if (isAdminPath) {
    return (
      <React.Suspense fallback={<PageState title="Loading dashboard" message="Preparing the admin dashboard." />}>
        <AdminDashboard />
      </React.Suspense>
    );
  }

  return (
    <SiteContentProvider>
      <LandingPage />
    </SiteContentProvider>
  );
}
