import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import { SafeImage } from "@/src/components/ui/SafeImage";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const HeroSection = () => {
  const { content } = useSiteContent();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white to-surface-grey pt-20">
      {/* Background decorative elements from design */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      <Container className="relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex justify-center sm:justify-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gold-soft text-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
              >
                🚀 Global Marketplace
              </motion.div>
            </div>

            <h1 className="text-[2.25rem] sm:text-5xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.05] md:leading-[0.9] tracking-tighter text-soft-black text-center sm:text-left">
              GROW YOUR <br className="sm:hidden" /><span className="text-gold">BUSINESS</span> <br className="hidden sm:block" />WITH <span className="text-soft-black">GOLDENHEART.</span>
            </h1>

            <p className="text-base md:text-xl text-medium-grey mb-8 md:mb-10 max-w-lg leading-relaxed text-center sm:text-left">
              The trusted global marketplace designed to help entrepreneurs connect with customers, sell faster, and scale globally.
            </p>

            <div className="flex flex-col gap-6 mb-10">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
                <Button size="lg" className="w-full sm:w-auto px-6 py-4 text-base sm:text-lg" onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}>
                  👉 Start Selling Today
                </Button>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2 text-sm font-semibold text-medium-grey">
                  <span>No Setup Fees</span>
                  <span className="w-1 h-1 bg-gold rounded-full" />
                  <span>Fast Approval</span>
                  <span className="w-1 h-1 bg-gold rounded-full" />
                  <span>Beginner-friendly</span>
                </div>
              </div>

              <div className="space-y-4 flex flex-col items-center sm:items-start">
                <p className="text-sm font-bold text-gold flex items-center justify-center sm:justify-start gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse" />
                  Takes less than 2 minutes to get started
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <SafeImage src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Merchant" className="w-full h-full object-cover" fallbackLabel="Merchant" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-medium-grey">
                    Join <span className="text-soft-black font-bold">1,200+ businesses</span> already thriving.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-full mt-12 lg:mt-0 flex items-center justify-center w-full overflow-visible"
          >
            {/* High-Fidelity CSS Smartphone Mockup */}
            <div className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] bg-soft-black rounded-[3rem] border-[8px] border-white/10 shadow-2xl shadow-gold/20 flex flex-col p-4 z-10 mx-auto">
              {/* Speaker/Notch Area */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-soft-black rounded-b-2xl z-20 flex items-center justify-center gap-2">
                <div className="w-10 h-1 bg-white/10 rounded-full" />
                <div className="w-2 h-2 bg-white/10 rounded-full" />
              </div>

              {/* Side Buttons */}
              <div className="absolute top-24 -left-[10px] w-[2px] h-12 bg-white/10 rounded-l-md" />
              <div className="absolute top-40 -left-[10px] w-[2px] h-12 bg-white/10 rounded-l-md" />
              <div className="absolute top-24 -right-[10px] w-[2px] h-16 bg-white/10 rounded-r-md" />

              {/* App Screen Content */}
              <div className="flex-1 bg-gradient-to-br from-soft-black via-near-black to-gold/10 rounded-[2rem] overflow-hidden relative flex flex-col p-5">
                {/* App Header */}
                <div className="flex items-center justify-between mb-8 pt-4">
                  <div className="w-14 h-14 shrink-0">
                    <SafeImage src={content?.heroLogoUrl} alt="Logo" className="w-full h-full object-contain" fallbackLabel="Logo" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <div className="w-6 h-1 bg-white/20 rounded-full mt-0.5" />
                  </div>
                </div>

                {/* Account Summary Card */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Store Revenue</p>
                  <p className="text-2xl font-black text-white">₦12,840.50</p>
                  <div className="mt-2 text-[10px] text-green-500 font-bold flex items-center gap-1">
                    <span>↑ 12% Growth</span>
                  </div>
                </div>

                {/* Dashboard Menu Items */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                    <div className="text-xl mb-1">📦</div>
                    <p className="text-[10px] text-white font-bold">142 Orders</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                    <div className="text-xl mb-1">📈</div>
                    <p className="text-[10px] text-white font-bold">Payouts</p>
                  </div>
                </div>

                {/* Recent Sales List */}
                <div className="flex-grow">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Latest Activity</p>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-xs">🛍️</div>
                        <div className="flex-1">
                          <div className="h-1.5 w-16 bg-white/20 rounded-full mb-1.5" />
                          <div className="h-1 w-10 bg-white/10 rounded-full" />
                        </div>
                        <p className="text-[10px] font-black text-gold">+$85.00</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* App Navigation Bar */}
                <div className="mt-auto h-12 bg-white/5 -mx-5 -mb-5 flex items-center justify-around px-4 border-t border-white/10">
                  <div className="w-5 h-5 bg-gold rounded-md" />
                  <div className="w-5 h-5 bg-white/10 rounded-md" />
                  <div className="w-5 h-5 bg-white/10 rounded-md" />
                  <div className="w-5 h-5 bg-white/10 rounded-md" />
                </div>
              </div>
            </div>

            {/* Decorative Floating Objects */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -left-4 sm:-left-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-center text-xl sm:text-2xl z-20"
            >
              🥇
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -right-4 sm:-right-10 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl shadow-gold/20 shadow-2xl flex items-center justify-center z-20 border-2 sm:border-4 border-white p-2"
            >
              <SafeImage src={content?.heroLogoUrl} alt="Logo" className="w-full h-full object-contain" fallbackLabel="Logo" referrerPolicy="no-referrer" />
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-10 -right-20 w-80 h-80 border border-gold/10 rounded-full z-0 pointer-events-none" />
            <div className="absolute -bottom-10 -left-20 w-64 h-64 border border-gold/5 rounded-full z-0 pointer-events-none" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
