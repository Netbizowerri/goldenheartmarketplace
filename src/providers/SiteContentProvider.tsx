import * as React from "react";
import { SITE_CONTENT } from "@/shared/site-content";
import type { SiteContent } from "@/shared/site-content";

interface SiteContentContextValue {
  content: SiteContent;
  isLoading: false;
  error: "";
  retry: () => Promise<void>;
}

const SiteContentContext = React.createContext<SiteContentContextValue | undefined>(undefined);

// Helper to extract relevant VITE_ environment variables overriding site content
function getMergedContent(): SiteContent {
  const env = import.meta.env;
  return {
    ...SITE_CONTENT,
    companyName: env.VITE_COMPANY_NAME || env.PUBLIC_COMPANY_NAME || SITE_CONTENT.companyName,
    companyEmail: env.VITE_COMPANY_EMAIL || env.PUBLIC_COMPANY_EMAIL || SITE_CONTENT.companyEmail,
    facebookUrl: env.VITE_FACEBOOK_URL || env.PUBLIC_FACEBOOK_URL || SITE_CONTENT.facebookUrl,
    whatsappGroupUrl: env.VITE_WHATSAPP_GROUP_URL || env.PUBLIC_WHATSAPP_GROUP_URL || SITE_CONTENT.whatsappGroupUrl,
    heroLogoUrl: env.VITE_HERO_LOGO_URL || env.PUBLIC_HERO_LOGO_URL || SITE_CONTENT.heroLogoUrl,
    deliveryImageUrl: env.VITE_DELIVERY_IMAGE_URL || env.PUBLIC_DELIVERY_IMAGE_URL || SITE_CONTENT.deliveryImageUrl,
    communityImageUrl: env.VITE_COMMUNITY_IMAGE_URL || env.PUBLIC_COMMUNITY_IMAGE_URL || SITE_CONTENT.communityImageUrl,
    merchantCountLabel: env.VITE_MERCHANT_COUNT_LABEL || env.PUBLIC_MERCHANT_COUNT_LABEL || SITE_CONTENT.merchantCountLabel,
    merchantCountValue: env.VITE_MERCHANT_COUNT_VALUE || env.PUBLIC_MERCHANT_COUNT_VALUE || SITE_CONTENT.merchantCountValue,
    joinCountLabel: env.VITE_JOIN_COUNT_LABEL || env.PUBLIC_JOIN_COUNT_LABEL || SITE_CONTENT.joinCountLabel,
    revenueGrowthStat: env.VITE_REVENUE_GROWTH_STAT || env.PUBLIC_REVENUE_GROWTH_STAT || SITE_CONTENT.revenueGrowthStat,
    revenueGrowthLabel: env.VITE_REVENUE_GROWTH_LABEL || env.PUBLIC_REVENUE_GROWTH_LABEL || SITE_CONTENT.revenueGrowthLabel,
  };
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo<SiteContentContextValue>(
    () => ({
      content: getMergedContent(),
      isLoading: false as const,
      error: "" as const,
      retry: async () => {},
    }),
    [],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const value = React.useContext(SiteContentContext);

  if (!value) {
    throw new Error("useSiteContent must be used within SiteContentProvider.");
  }

  return value;
}
