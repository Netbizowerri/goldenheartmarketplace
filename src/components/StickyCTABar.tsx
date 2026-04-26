import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";

export const StickyCTABar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx 700px)
      setShow(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 py-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:hidden"
        >
          <Container className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-gold tracking-widest leading-none mb-1">Scale Fast</span>
              <span className="text-sm font-black text-soft-black leading-none tracking-tighter">GOLDENHEART</span>
            </div>
            <Button size="sm" className="px-6 shadow-none" onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started 👉
            </Button>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
