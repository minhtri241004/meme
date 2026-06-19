export interface Product {
  product_id: string;
  product_name: string;
  brand: string;
  category: string;
  material: string;
  color: string;
  size_available: string;
  gender: string;
  season: string;
  price_usd: number;
  description: string;
  care_instructions: string;
}

export interface Filters {
  search: string;
  category: string;
  brand: string;
  material: string;
  color: string;
  gender: string;
  season: string;
  size: string;
  sortBy: 'default' | 'price-asc' | 'price-desc';
}

export const CATEGORIES = [
  'T-shirt', 'Shirt', 'Hoodie', 'Jacket',
  'Jeans', 'Shorts', 'Sweater', 'Dress', 'Skirt'
] as const;

export const BRANDS = [
  'MekongBasics', 'UrbanLeaf', 'SaigonStyle',
  'LotusFashion', 'VietWear', 'NorthWind'
] as const;

export const MATERIALS = [
  'Cotton', 'Cotton Blend', 'Polyester', 'Denim',
  'Linen', 'Wool'
] as const;

export const COLORS = [
  'Black', 'White', 'Gray', 'Brown', 'Blue',
  'Red', 'Green', 'Beige'
] as const;

export const GENDERS = ['Men', 'Women', 'Unisex'] as const;

export const SEASONS = [
  'Spring', 'Summer', 'Autumn', 'Winter', 'All-season'
] as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
