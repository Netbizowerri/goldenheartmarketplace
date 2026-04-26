import { motion } from "motion/react";
import { Container } from "@/src/components/ui/Container";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Quote } from "lucide-react";
import { useSiteContent } from "@/src/providers/SiteContentProvider";

export const TestimonialsSection = () => {
  const { content } = useSiteContent();
  const testimonials = content?.testimonials ?? [];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container>
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            What Our <span className="text-gold">Merchants</span> Are Saying
          </motion.h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={`${t.author}-${i}`} className="h-full">
              <div className="bg-gray-50 p-8 rounded-3xl h-full border border-gray-100 flex flex-col relative group transition-all duration-300 hover:bg-white hover:shadow-xl hover:border-gold/20">
                <div className="mb-6">
                  <Quote className="text-gold w-10 h-10 opacity-20" />
                </div>
                <p className="text-lg text-gray-800 mb-8 italic flex-grow leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-xl font-bold text-gold">
                    {t.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-near-black">{t.author}</h4>
                    <p className="text-xs text-gold font-semibold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};
