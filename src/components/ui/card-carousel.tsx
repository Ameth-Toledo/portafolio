"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules"
import { ExternalLink } from "lucide-react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"

export interface Certificate {
  title: string
  issuer: string
  category: string
  file: string
  accent: string
}

interface CardCarouselProps {
  certificates: Certificate[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
}

const css = `
  .cert-swiper { width: 100%; padding-bottom: 50px; }
  .cert-swiper .swiper-slide { width: 340px; }
  .swiper-3d .swiper-slide-shadow-left,
  .swiper-3d .swiper-slide-shadow-right { background: none; }
`

export const CardCarousel: React.FC<CardCarouselProps> = ({
  certificates,
  autoplayDelay = 2000,
  showPagination = true,
  showNavigation = true,
}) => {
  return (
    <section className="w-full">
      <style>{css}</style>
      <Swiper
        className="cert-swiper"
        spaceBetween={30}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
        pagination={showPagination}
        navigation={showNavigation ? { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } : undefined}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {certificates.map((cert, i) => (
          <SwiperSlide key={i}>
            <CertCard cert={cert} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

function CertCard({ cert }: { cert: Certificate }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-md flex flex-col" style={{ height: 440 }}>
      {/* Colored header strip */}
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: cert.accent }}>
        <span className="text-xs font-bold uppercase tracking-widest text-white/90">{cert.issuer}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider bg-white/20 text-white rounded-full px-2 py-0.5">{cert.category}</span>
      </div>

      {/* PDF preview */}
      <div className="flex-1 overflow-hidden bg-muted relative">
        <iframe
          src={`/assets/pdf/${encodeURIComponent(cert.file)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          className="absolute inset-0 w-full border-0"
          style={{ height: 'calc(100% + 40px)', top: '-10px', pointerEvents: 'none' }}
          scrolling="no"
          title={cert.title}
        />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 flex-1">{cert.title}</p>
        <a
          href={`/assets/pdf/${cert.file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink size={12} />
          Ver
        </a>
      </div>
    </div>
  )
}
