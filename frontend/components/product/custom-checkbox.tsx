"use client"

import { Check } from "lucide-react"

interface CheckboxProps {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function Checkbox({ id, checked, onCheckedChange, className = "" }: CheckboxProps) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`flex items-center justify-center w-4 h-4 border border-gray-300 rounded cursor-pointer transition-colors ${
          checked ? "bg-pink-600 border-pink-600" : "bg-white hover:border-pink-500"
        } ${className}`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </label>
    </div>
  )
}