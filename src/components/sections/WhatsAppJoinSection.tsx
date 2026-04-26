import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { MessageCircle, Users, Bell, Zap } from "lucide-react";
import { SafeImage } from "@/src/components/ui/SafeImage";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const WhatsAppJoinSection = () => {
  const { content } = useSiteContent();

  return (
    <section className="py-20 bg-gold relative overflow-hidden" id="community">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 border-8 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border-8 border-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <Container>
        <div className="bg-soft-black rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/20 blur-[80px] rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-2 rounded-full text-gold text-xs font-black uppercase tracking-widest mb-6"
              >
                <MessageCircle size={14} /> Exclusive Community
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Join 500+ Top <span className="text-gold">Nigerian Merchants</span> On WhatsApp
              </h2>
              
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                Get instant updates, marketplace tips, and connect with other successful entrepreneurs in our private inner circle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: <Zap size={18} />, text: "Fastest Support" },
                  { icon: <Users size={18} />, text: "Vendor Networking" },
                  { icon: <Bell size={18} />, text: "Marketplace Updates" },
                  { icon: <MessageCircle size={18} />, text: "Direct Feedback" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 font-bold text-sm">
                    <div className="text-gold">{item.icon}</div>
                    {item.text}
                  </div>
                ))}
              </div>

              <motion.a
                href={content?.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-gold text-soft-black px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-gold/20 hover:bg-white transition-colors"
              >
                <MessageCircle size={24} />
                Join WhatsApp Group
              </motion.a>
            </div>

            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, rotate: -5, y: 50 }}
                whileInView={{ opacity: 1, rotate: 0, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 bg-white p-4 rounded-[2rem] shadow-2xl rotate-3"
              >
                <SafeImage src={content?.communityImageUrl} alt="Merchant Community" className="rounded-xl w-full h-auto object-cover" fallbackLabel="Merchant community" />
                <div className="absolute -bottom-6 -left-6 bg-gold text-soft-black p-6 rounded-2xl shadow-xl">
                  <p className="font-black text-2xl leading-none">Inner Circle</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Members Only</p>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 right-0 bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg"
              >
                LIVE CHAT ACTIVE
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
