import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Why Join", href: "#benefits" },
    { label: "Products", href: "#products" },
    { label: "Growth", href: "#growth" },
    { label: "Steps", href: "#how-it-works" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md border-gray-100 shadow-sm py-3" 
            : "bg-white border-transparent py-5"
        }`}
      >
        <Container className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink" onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="text-[15px] xs:text-lg sm:text-xl md:text-2xl font-black tracking-tight text-soft-black leading-tight">
              GOLDENHEART <span className="text-gold">MARKETPLACE</span>
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-medium-grey mr-4">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="hover:text-gold transition-colors underline-offset-4 hover:underline">
                  {link.label}
                </a>
              ))}
            </div>
            <Button 
              variant="primary" 
              size="sm"
              className="hidden md:flex"
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Sign Up Now
            </Button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-1 text-soft-black hover:text-gold transition-colors focus:outline-none shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </Container>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[64px] sm:top-[80px] left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-xl lg:hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              {navLinks.map(link => (
                <a 
                  key={link.label}
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-black text-soft-black hover:text-gold transition-colors px-2"
                >
                  {link.label}
                </a>
              ))}
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => { setIsOpen(false); document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Start Selling Today
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

