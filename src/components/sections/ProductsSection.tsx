import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/src/components/ui/SafeImage";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const ProductsSection = () => {
  const { content } = useSiteContent();
  const products = content?.products ?? [];

  return (
    <section className="py-24 bg-white" id="products">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl text-center md:text-left">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-4 block"
            >
              Marketplace Preview
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-soft-black"
            >
              Sell Your <span className="text-gold">Best Products</span> To The World
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <button className="flex items-center gap-2 font-black text-soft-black hover:text-gold transition-colors group">
              Browse Categories <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>

        <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="shrink-0 w-64 md:w-80 snap-center group cursor-pointer"
              >
                <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-gray-100 mb-6 relative shadow-lg shadow-black/5">
                  <SafeImage 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    fallbackLabel={product.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <span className="bg-white text-soft-black px-6 py-2 rounded-full font-black text-xs shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Quick View
                    </span>
                  </div>
                </div>
                <div className="px-2">
                  <p className="text-[10px] font-black uppercase text-gold tracking-widest mb-1">{product.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
