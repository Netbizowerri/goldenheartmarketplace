import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { ShieldCheck, UserCheck, Timer } from "lucide-react";

export const TrustBadges = () => {
  return (
    <div className="bg-gray-50 border-y border-gray-100 py-6">
      <Container>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3 text-medium-grey">
            <ShieldCheck className="text-gold w-6 h-6" />
            <span className="font-bold text-sm uppercase tracking-wider">Secure Payments</span>
          </div>
          <div className="flex items-center gap-3 text-medium-grey">
            <UserCheck className="text-gold w-6 h-6" />
            <span className="font-bold text-sm uppercase tracking-wider">Verified Merchants</span>
          </div>
          <div className="flex items-center gap-3 text-medium-grey">
            <Timer className="text-gold w-6 h-6" />
            <span className="font-bold text-sm uppercase tracking-wider">Fast Onboarding</span>
          </div>
        </div>
      </Container>
    </div>
  );
};
