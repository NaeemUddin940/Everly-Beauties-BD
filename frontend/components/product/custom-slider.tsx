"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step?: number
  className?: string
}

export function Slider({ value, onValueChange, min, max, step = 1, className = "" }: SliderProps) {
  const [isDragging, setIsDragging] = useState<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(index)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging === null || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const newValue = min + (percentage / 100) * (max - min)
    const steppedValue = Math.round(newValue / step) * step

    const newValues = [...value]
    newValues[isDragging] = Math.max(min, Math.min(max, steppedValue))

    if (isDragging === 0 && newValues[0] > newValues[1]) {
      newValues[0] = newValues[1]
    } else if (isDragging === 1 && newValues[1] < newValues[0]) {
      newValues[1] = newValues[0]
    }

    onValueChange(newValues)
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className={`relative ${className}`}>
      <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer">
        {/* Track between thumbs */}
        <div
          className="absolute h-2 bg-pink-500 rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`,
          }}
        />

        {/* Thumb 1 */}
        <div
          className="absolute w-4 h-4 bg-pink-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
          style={{ left: `${getPercentage(value[0])}%` }}
          onMouseDown={handleMouseDown(0)}
        />

        {/* Thumb 2 */}
        <div
          className="absolute w-4 h-4 bg-pink-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform"
          style={{ left: `${getPercentage(value[1])}%` }}
          onMouseDown={handleMouseDown(1)}
        />
      </div>
    </div>
  )
}