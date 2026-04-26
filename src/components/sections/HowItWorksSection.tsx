import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const HowItWorksSection = () => {
  const { content } = useSiteContent();
  const steps = content?.howItWorksSteps ?? [];

  return (
    <section className="py-24 bg-near-black text-white overflow-hidden" id="how-it-works">
      <Container>
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Start Selling in <span className="text-gold">3 Simple Steps</span>
          </motion.h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12 relative">
          <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-gold/30 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-2xl font-black text-white mb-8 shadow-xl shadow-gold/10 ring-8 ring-white/5">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-400 max-w-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
