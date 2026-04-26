import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { TrendingUp, Globe, Users, BarChart3 } from "lucide-react";
import { SafeImage } from "@/src/components/ui/SafeImage";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const DeliverySection = () => {
  const { content } = useSiteContent();

  return (
    <section className="py-24 bg-soft-black text-white overflow-hidden" id="growth">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-6 block">Business Growth</span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Scale Your <span className="text-gold">Brand</span> To New <span className="text-gold">Heights.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-lg leading-relaxed">
              We don't just list products; we build empires. Our ecosystem is designed to take local businesses and make them national stars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {[
                { icon: <Globe className="text-gold" />, title: "National Reach", desc: "Instantly accessible to millions of shoppers nationwide." },
                { icon: <TrendingUp className="text-gold" />, title: "Revenue Boost", desc: "Optimized sales funnels to maximize your conversion rate." },
                { icon: <Users className="text-gold" />, title: "Community Access", desc: "Collaborate with a network of elite Nigerian vendors." },
                { icon: <BarChart3 className="text-gold" />, title: "Data Insights", desc: "Deep analytics to help you understand your customers." }
              ].map((item, idx) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-white">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gold/10 border border-gold/20 p-6 rounded-3xl inline-flex items-center gap-4"
            >
              <div className="text-4xl font-black text-gold">{content?.revenueGrowthStat}</div>
              <div className="text-sm text-gray-300 font-bold leading-tight">
                {content?.revenueGrowthLabel}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gold/20 blur-[120px] rounded-full" />
            <div className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl border-4 border-white/5">
              <SafeImage src={content?.deliveryImageUrl} alt="Nigerian Merchant Growth" className="w-full h-full object-cover" fallbackLabel="Merchant growth" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-soft-black via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 p-8 glass-card rounded-[2rem]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center text-soft-black">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="font-black text-white text-lg tracking-tighter">Growth Active</p>
                    <p className="text-xs text-gold font-bold">Scaling Verified Merchant</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-gold" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
