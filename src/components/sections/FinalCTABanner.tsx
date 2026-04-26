import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import CountUp from "react-countup";

export const FinalCTABanner = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with Brand Pattern */}
      <div className="absolute inset-0 bg-gold z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0" />
      
      <Container className="relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8 flex justify-center">
            <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
              <CountUp end={1200} suffix="+" duration={2.5} enableScrollSpy scrollSpyOnce /> Businesses Growing With Us
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[1.1] tracking-tighter">
            READY TO GROW YOUR <span className="text-soft-black">BUSINESS?</span>
          </h2>
          
          <p className="text-xl text-white/95 mb-14 max-w-2xl mx-auto font-medium">
            Join thousands of successful merchants building their legacy with GoldenHeart Marketplace.
          </p>

          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-soft-black text-white px-12 py-5 text-xl font-black hover:scale-105 transition-transform"
            onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            👉 Join GoldenHeart Now
          </Button>

          <div className="mt-12 flex justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/60">
            <span>No Signup Fees</span>
            <span>24/7 Support</span>
            <span>Global Reach</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
