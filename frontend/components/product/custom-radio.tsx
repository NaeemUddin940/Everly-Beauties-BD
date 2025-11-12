"use client"

interface RadioProps {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  className?: string
}

export function Radio({ id, name, value, checked, onChange, className = "" }: RadioProps) {
  return (
    <div className="relative">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`flex items-center justify-center w-4 h-4 border border-gray-300 rounded-full cursor-pointer transition-colors ${
          checked ? "bg-pink-600 border-pink-600" : "bg-white hover:border-pink-500"
        } ${className}`}
      >
        {checked && <div className="w-2 h-2 bg-white rounded-full" />}
      </label>
    </div>
  )
}