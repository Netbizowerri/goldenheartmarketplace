import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Apple, Play } from "lucide-react";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const AppDownloadsSection = () => {
  const { content } = useSiteContent();
  const appLinks = content?.appLinks;

  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            📲 Download the <span className="text-gold">GoldenHeart Apps</span>
          </motion.h2>
          <p className="text-lg text-medium-grey">Experience the marketplace on the go.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative group"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold/5 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-3xl mb-6">🛍️</div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">GoldenHeart Customer App</h3>
              <p className="text-medium-grey mb-8">The ultimate shopping experience. Browse thousands of products, secure payments, and fast delivery.</p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href={appLinks?.customer.ios} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-near-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold leading-none">Download on the</p>
                    <p className="text-lg font-bold leading-tight">App Store</p>
                  </div>
                </a>
                <a 
                  href={appLinks?.customer.android} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-near-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                    <Play className="w-4 h-4 text-near-black fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold leading-none">Get it on</p>
                    <p className="text-lg font-bold leading-tight">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-near-black text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl overflow-hidden relative group"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold/20 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6">🚗</div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">GoldenHeart Driver App</h3>
              <p className="text-gray-400 mb-8">Join our logistics network. Earn money by delivering products to happy customers across the city.</p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href={appLinks?.driver.ios} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-near-black px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold leading-none">Download on the</p>
                    <p className="text-lg font-bold leading-tight">App Store</p>
                  </div>
                </a>
                <a 
                  href={appLinks?.driver.android} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-near-black px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform"
                >
                   <div className="w-6 h-6 flex items-center justify-center bg-near-black rounded-full text-white">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold leading-none">Get it on</p>
                    <p className="text-lg font-bold leading-tight">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
