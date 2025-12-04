'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const VariationSelector = ({ variations }) => {
  const [selectedVariation, setSelectedVariation] = useState(variations?.[0])
  const swiperRef = useRef<SwiperType | null>(null)
  const navigationPrevRef = useRef<HTMLButtonElement>(null)
  const navigationNextRef = useRef<HTMLButtonElement>(null)

  if (!variations || variations.length === 0) return null

  const handleSelect = (variation) => {
    setSelectedVariation(variation)
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">
        Select Variation: 
        <span id='selected-variation-name' className='text-primary pl-2 text-[16px] font-semibold'>
          {selectedVariation?.name}
        </span>
      </h3>
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          slidesPerView={6}
          spaceBetween={10}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper
          }}
          breakpoints={{
            320: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 7 }
          }}
          className="!px-1"
        >
          {variations.map((variation) => (
            <SwiperSlide key={variation.id} className="max-w-20">
              <button
                onClick={() => handleSelect(variation)}
                className={`w-20 h-20 rounded-lg overflow-hidden relative variation-image transition-all ${
                  selectedVariation?.id === variation.id
                    ? 'border-2 border-pink-500 scale-105'
                    : 'border border-gray-200 hover:border-gray-400'
                }`}
              >
                <Image
                  src={variation.image}
                  alt={variation.name}
                  className="w-full h-full object-cover cursor-pointer"
                  width={80}
                  height={80}
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1/1'
                  }}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {variations.length > 4 && (
          <>
            <button
              ref={navigationPrevRef}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous variation"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              ref={navigationNextRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next variation"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VariationSelector