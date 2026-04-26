import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Facebook, Mail, MessageSquare, MapPin, ExternalLink } from "lucide-react";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const Footer = () => {
  const { content } = useSiteContent();

  return (
    <footer className="bg-surface-grey border-t border-gray-200 pt-20 pb-10">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
             <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-soft-black rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gold rounded-full" />
              </div>
              <span className="text-xl font-black text-soft-black tracking-tight">GOLDENHEART</span>
            </div>
            <p className="text-medium-grey mb-8 max-w-sm leading-relaxed text-sm">
              Nigeria's most trusted global marketplace connecting verified merchants with millions of customers worldwide.
            </p>
            <div className="flex items-center gap-3">
              <a href={content?.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gold hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={`mailto:${content?.companyEmail}`} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gold hover:text-white transition-all">
                <Mail className="w-4 h-4" />
              </a>
              <a href={content?.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gold hover:text-white transition-all">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-soft-black mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-semibold text-medium-grey">
              <li><a href="#benefits" className="hover:text-gold transition-colors">Why Join Us</a></li>
              <li><a href="#how-it-works" className="hover:text-gold transition-colors">How It Works</a></li>
              <li><a href="#signup" className="hover:text-gold transition-colors">Create Account</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-soft-black mb-6">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-gold w-5 h-5 shrink-0" />
                <span className="text-medium-grey text-sm font-medium">GoldenHeart Global Hub, Nigeria & Worldwide Logistics Network.</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-gold w-5 h-5 shrink-0" />
                <a href={`mailto:${content?.companyEmail}`} className="text-medium-grey text-sm font-medium hover:text-gold transition-colors">{content?.companyEmail}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
          <div className="flex gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Secure Payments</span>
            <span>Verified Merchants</span>
            <span>Global Logistics</span>
          </div>
          <div className="text-[11px] text-medium-grey font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} {content?.companyName}. All Rights Reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};
