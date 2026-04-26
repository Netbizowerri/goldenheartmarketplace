import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  const { content } = useSiteContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 blur-3xl rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={24} />
            </button>

            <div className="relative text-center">
              <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-xl shadow-gold/20">
                🎉
              </div>
              
              <h2 className="text-3xl font-black text-soft-black mb-4">Application Sent!</h2>
              <p className="text-lg text-medium-grey mb-10 leading-relaxed">
                Welcome to GoldenHeart! Our merchant onboarding team will contact you via WhatsApp or Email within 24 hours.
              </p>

              <div className="space-y-4">
                <Button 
                  onClick={() => window.open(content?.whatsappGroupUrl, '_blank')} 
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] border-none text-white py-4 h-auto text-lg flex items-center justify-center gap-2"
                >
                  Join Merchant Group
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="w-full py-4 h-auto text-lg"
                >
                  Back to Home
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <CheckCircle2 size={14} className="text-gold" />
                Verified Merchant Onboarding
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
