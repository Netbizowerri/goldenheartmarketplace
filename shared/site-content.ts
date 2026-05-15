export interface ProductPreview {
  name: string;
  price: string;
  image: string;
  category: string;
}

export interface BenefitCard {
  title: string;
  description: string;
  icon: "Globe" | "Zap" | "ShieldCheck" | "Rocket" | "HeartHandshake";
  color: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface SiteContent {
  companyName: string;
  companyEmail: string;
  facebookUrl: string;
  whatsappGroupUrl: string;
  heroLogoUrl: string;
  deliveryImageUrl: string;
  communityImageUrl: string;
  merchantCountLabel: string;
  merchantCountValue: string;
  joinCountLabel: string;
  revenueGrowthStat: string;
  revenueGrowthLabel: string;
  merchantCategories: string[];
  appLinks: {
    customer: {
      ios: string;
      android: string;
    };
    driver: {
      ios: string;
      android: string;
    };
  };
  products: ProductPreview[];
  benefits: BenefitCard[];
  howItWorksSteps: HowItWorksStep[];
  testimonials: Testimonial[];
}

export const SITE_CONTENT: SiteContent = {
  companyName: "GoldenHeart Marketplace",
  companyEmail: "support@example.com",
  facebookUrl: "https://www.facebook.com/",
  whatsappGroupUrl: "https://wa.me/2349028562368",
  heroLogoUrl: "https://i.postimg.cc/L4WZ4fzX/logo.png",
  deliveryImageUrl: "https://i.postimg.cc/qMK5MX3g/Goldenheart(2).jpg",
  communityImageUrl: "https://i.postimg.cc/7YzWYM2P/Goldenheart(3).jpg",
  merchantCountLabel: "Active Merchants",
  merchantCountValue: "1,000+",
  joinCountLabel: "Join 1,200+ businesses already thriving.",
  revenueGrowthStat: "+145%",
  revenueGrowthLabel: "Average vendor revenue growth in the first 90 days",
  merchantCategories: [
    "Retail & General Merchants",
    "Restaurants & Food Vendors",
    "Delivery Services",
    "Fashion & Accessories",
    "Health & Wellness",
    "Beauty & Spa Services",
    "Real Estate Agents",
    "Technicians & Artisans",
    "Skilled Trade Experts",
    "Professional Services",
    "Home Services",
    "Handmade & Crafts",
    "Other Global Sellers",
  ],
  appLinks: {
    customer: {
      ios: "https://apps.apple.com/ca/app/goldheart-marketplace/id6754158112",
      android: "https://play.google.com/store/apps/details?id=com.customer.mobamarketplacenew",
    },
    driver: {
      ios: "https://apps.apple.com/ca/app/goldheart-driver/id6754158989",
      android: "https://play.google.com/store/apps/details?id=com.driver.mobamarketplacenew",
    },
  },
  products: [
    {
      name: "Handcrafted Ankara Bag",
      price: "NGN 15,000",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
      category: "Fashion",
    },
    {
      name: "Pure Shea Butter Set",
      price: "NGN 8,500",
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop",
      category: "Self Care",
    },
    {
      name: "Modern African Art",
      price: "NGN 45,000",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
      category: "Decor",
    },
    {
      name: "Organic Coffee Blend",
      price: "NGN 12,000",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
      category: "Beverage",
    },
  ],
  benefits: [
    {
      title: "Global Visibility",
      description: "Reach customers across Nigeria and beyond from one verified merchant account.",
      icon: "Globe",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Instant Setup",
      description: "Launch your merchant profile quickly without needing a technical team.",
      icon: "Zap",
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      title: "Secure Payments",
      description: "Built-in payment flows help you get paid safely and on time.",
      icon: "ShieldCheck",
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Growth Support",
      description: "Use analytics and support tools that help your store keep improving.",
      icon: "Rocket",
      color: "bg-indigo-500/10 text-indigo-600",
    },
    {
      title: "Dedicated Partner",
      description: "Work with a team that helps you expand into new markets with confidence.",
      icon: "HeartHandshake",
      color: "bg-red-500/10 text-red-600",
    },
  ],
  howItWorksSteps: [
    {
      number: "01",
      title: "Create Account",
      description: "Complete the signup form and confirm your contact details.",
    },
    {
      number: "02",
      title: "Set Up Shop",
      description: "Add your products or services, pricing, and business details.",
    },
    {
      number: "03",
      title: "Start Earning",
      description: "Reach new buyers and grow with marketplace support behind you.",
    },
  ],
  testimonials: [
    {
      quote: "GoldenHeart Marketplace helped me reach more customers than I ever expected. My sales doubled after joining.",
      author: "Sarah J.",
      role: "Verified Fashion Vendor",
    },
    {
      quote: "The onboarding process was simple, and I started selling my handmade crafts within a day.",
      author: "Michael O.",
      role: "Verified Artisan",
    },
    {
      quote: "Fast approval and clear support made GoldenHeart a practical growth channel for my business.",
      author: "Amina K.",
      role: "Verified Food Merchant",
    },
  ],
};

export function buildSiteContent(env: NodeJS.ProcessEnv): SiteContent {
  return {
    ...SITE_CONTENT,
    companyName: env.PUBLIC_COMPANY_NAME || SITE_CONTENT.companyName,
    companyEmail: env.PUBLIC_COMPANY_EMAIL || SITE_CONTENT.companyEmail,
    facebookUrl: env.PUBLIC_FACEBOOK_URL || SITE_CONTENT.facebookUrl,
    whatsappGroupUrl: env.PUBLIC_WHATSAPP_GROUP_URL || SITE_CONTENT.whatsappGroupUrl,
    heroLogoUrl: env.PUBLIC_HERO_LOGO_URL || SITE_CONTENT.heroLogoUrl,
    deliveryImageUrl: env.PUBLIC_DELIVERY_IMAGE_URL || SITE_CONTENT.deliveryImageUrl,
    communityImageUrl: env.PUBLIC_COMMUNITY_IMAGE_URL || SITE_CONTENT.communityImageUrl,
    merchantCountLabel: env.PUBLIC_MERCHANT_COUNT_LABEL || SITE_CONTENT.merchantCountLabel,
    merchantCountValue: env.PUBLIC_MERCHANT_COUNT_VALUE || SITE_CONTENT.merchantCountValue,
    joinCountLabel: env.PUBLIC_JOIN_COUNT_LABEL || SITE_CONTENT.joinCountLabel,
    revenueGrowthStat: env.PUBLIC_REVENUE_GROWTH_STAT || SITE_CONTENT.revenueGrowthStat,
    revenueGrowthLabel: env.PUBLIC_REVENUE_GROWTH_LABEL || SITE_CONTENT.revenueGrowthLabel,
  };
}
