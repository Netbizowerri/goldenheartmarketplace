import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";

const categories = [
  { label: "Retail & Merchants", icon: "🏬" },
  { label: "Restaurants & Food", icon: "🍱" },
  { label: "Fashion & Style", icon: "👗" },
  { label: "Health & Wellness", icon: "🧘" },
  { label: "Beauty & Spa", icon: "✨" },
  { label: "Real Estate", icon: "🏠" },
  { label: "Artisans & Techs", icon: "🛠️" },
  { label: "Skilled Trades", icon: "👷" },
  { label: "Professional Services", icon: "📂" },
  { label: "Home Services", icon: "🧹" },
  { label: "Delivery Services", icon: "🚚" },
  { label: "Handmade & Crafts", icon: "🧶" },
  { label: "Global Sellers", icon: "🌎" },
];

export const WhoCanJoinSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            Built for Every <span className="text-gold">Entrepreneur</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-medium-grey"
          >
            If you have a skill, product, or service — GoldenHeart is for you. We welcome visionaries from all walks of life.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -3, backgroundColor: "rgba(212, 160, 23, 0.05)" }}
              className="bg-white border border-gray-100 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 shadow-sm hover:shadow-md hover:border-gold/30 transition-all cursor-default group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 group-hover:bg-gold/10 rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-colors">
                {cat.icon}
              </div>
              <div>
                <span className="font-bold text-gray-800 text-xs sm:text-sm md:text-base leading-tight block">
                  {cat.label}
                </span>
                <span className="hidden sm:block text-[10px] text-medium-grey mt-1 font-medium">Click to learn more</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
