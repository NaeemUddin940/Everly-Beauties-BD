export interface Product {
  id: number
  name: string
  price: string
  regularPrice: string
  salePrice: string | null
  productImage: string | null
  permalink: string
  rating_count: number
  average_rating: number
  categories: string[]
  attributes: Record<string, any>
}

export interface FilterTerm {
  term_id: number
  name: string
  slug: string
  count: number
}

export interface FilterOptions {
  price_range: {
    min: number
    max: number
  }
  categories?: FilterTerm[]
  brands?: FilterTerm[]
  benefits?: FilterTerm[]
  made_in?: FilterTerm[]
  type_of_skins?: FilterTerm[]
  finish?: FilterTerm[]
}

export interface ApiResponse {
  products: Product[]
  total: number
  total_pages: number
  current_page: number
  filter_options: FilterOptions
  sorting_options: Record<string, string>
  current_sorting: string
}

export interface FilterState {
  min_price?: number
  max_price?: number
  categories?: string
  brand?: string
  benefits?: string
  made_in?: string
  type_of_skins?: string
  finish?: string
  orderby?: string
  order?: string
  page?: number
  per_page?: number
}