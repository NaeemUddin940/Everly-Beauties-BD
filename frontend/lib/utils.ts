import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a price as a string with currency symbol
export function formatPrice(price: string | number, currency = "$") {
  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

  if (isNaN(numericPrice)) {
    return `${currency}0.00`
  }

  return `${currency}${numericPrice.toFixed(2)}`
}

// Generate a random string of specified length
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

// Truncate text to a specified length, adding ellipsis if truncated
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// Parse URLSearchParams into a more usable object format
export function parseSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string | string[]> = {}

  searchParams.forEach((value, key) => {
    if (params[key]) {
      params[key] = Array.isArray(params[key]) ? [...(params[key] as string[]), value] : [params[key] as string, value]
    } else {
      params[key] = value
    }
  })

  return params
}

// Create a new URLSearchParams object with updates applied
export function createSearchParams(currentParams: URLSearchParams, updates: Record<string, string | null>) {
  const newParams = new URLSearchParams(currentParams.toString())

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
  })

  return newParams
}