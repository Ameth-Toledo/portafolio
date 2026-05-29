import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Awards } from '@/components/ui/award'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const css = `
  .cert-swiper { width: 100%; padding-bottom: 48px; }
  .cert-swiper .swiper-slide { width: 260px; }
  .swiper-3d .swiper-slide-shadow-left,
  .swiper-3d .swiper-slide-shadow-right { background: none; }
`

const certificates = [
  {
    title:     'Cloud Architecting',
    subtitle:  'has completed AWS Academy Cloud Architecting',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'AWS_Academy_Graduate___AWS_Academy_Cloud_Architecting.pdf',
  },
  {
    title:     'Cloud Developing',
    subtitle:  'has completed AWS Academy Cloud Developing',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'AWS_Academy_Graduate___AWS_Academy_Cloud_Developing.pdf',
  },
  {
    title:     'Cloud Foundations',
    subtitle:  'has completed AWS Academy Cloud Foundations',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations.pdf',
  },
  {
    title:     'Ciberseguridad',
    subtitle:  'ha completado Introducción a Ciberseguridad',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'Introducción a Ciberseguridad.pdf',
  },
  {
    title:     'Networking Basics',
    subtitle:  'ha completado Networking Basics',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'NetworkingBasics.pdf',
  },
  {
    title:     'Sistemas Operativos',
    subtitle:  'ha completado Sistemas Operativos',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'SistemasOperativos.pdf',
  },
  {
    title:     'UI/UX Diseño',
    subtitle:  'ha completado el certificado de UI/UX',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'UI-UXCertificado.pdf',
  },
  {
    title:     'Gestión de Amenazas',
    subtitle:  'ha completado Gestión de Amenazas Cibernéticas',
    recipient: 'Ameth De Jesús Méndez Toledo',
    date:      '2024',
    file:      'Gestion_de_amenazas_ciberneticas.pdf',
  },
]

export function CertificacionesSection() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div className="w-full h-full bg-background flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 overflow-hidden">
      <style>{css}</style>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <p className="mb-1 font-mono text-xs tracking-widest text-[#C3E41D] uppercase">./certificaciones</p>
          <h2 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Certificaciones
          </h2>
        </div>

        <div
          onMouseEnter={() => swiperRef.current?.autoplay.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay.start()}
        >
        <Swiper
          className="cert-swiper"
          spaceBetween={24}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView="auto"
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
          pagination
          modules={[EffectCoverflow, Autoplay, Pagination]}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
        >
          {certificates.map((cert) => (
            <SwiperSlide key={cert.file}>
              <a
                href={`/assets/pdf/${encodeURIComponent(cert.file)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Awards
                  variant="certificate"
                  title={cert.title}
                  subtitle={cert.subtitle}
                  recipient={cert.recipient}
                  date={cert.date}
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
    </div>
  )
}
