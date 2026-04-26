import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const FloatingWhatsApp = () => {
  const { content } = useSiteContent();

  return (
    <motion.a
      href={content?.whatsappGroupUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 2 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-[60] bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl shadow-green-500/40 group overflow-hidden"
      aria-label="Join WhatsApp Group"
    >
      <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75" />
      
      <MessageCircle className="w-8 h-8 relative z-10" fill="currentColor" />
      
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-near-black px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100 pointer-events-none">
        Join our Community! 🚀
      </div>
    </motion.a>
  );
};
