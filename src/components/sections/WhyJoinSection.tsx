import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { ShieldCheck, Zap, Globe, HeartHandshake, Rocket } from "lucide-react";
import { SafeImage } from "@/src/components/ui/SafeImage";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

const iconMap = {
  Globe,
  Zap,
  ShieldCheck,
  Rocket,
  HeartHandshake,
};

export const WhyJoinSection = () => {
  const { content } = useSiteContent();
  const benefits = content?.benefits ?? [];

  return (
    <section className="py-24 bg-white" id="benefits">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            Why Merchants Choose <span className="text-gold">GoldenHeart</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-medium-grey"
          >
            We don't just list your business — we help you grow it. Join thousands of vendors who trust us with their vision.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon];

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-medium-grey leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-3xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center text-center overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/20 blur-3xl rounded-full" />
            <h3 className="text-2xl font-black mb-2 text-gold">{content?.merchantCountValue}</h3>
            <p className="text-near-black font-semibold">{content?.merchantCountLabel}</p>
            <p className="text-sm text-medium-grey mt-2">Joining the revolution</p>
            <div className="mt-6 flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                  <SafeImage src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Merchant" className="w-full h-full object-cover" fallbackLabel="Merchant" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
