import Papa from 'papaparse';
import type { Product, Filters } from '../types/product';

export async function loadProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/rag_dataset.csv');
    const csvText = await response.text();

    const result = Papa.parse<Product>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (h: string) => h.trim(),
      transform: (value: string) => value.trim(),
    });

    return result.data.map((row) => ({
      ...row,
      price_usd: parseFloat(String(row.price_usd)) || 0,
    }));
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export function filterProducts(products: Product[], filters: Filters): Product[] {
  let result = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.product_name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand);
  }
  if (filters.material) {
    result = result.filter((p) => p.material === filters.material);
  }
  if (filters.color) {
    result = result.filter((p) => p.color === filters.color);
  }
  if (filters.gender) {
    result = result.filter((p) => p.gender === filters.gender);
  }
  if (filters.season) {
    result = result.filter((p) => p.season === filters.season);
  }
  if (filters.size) {
    result = result.filter((p) =>
      p.size_available.split(',').map((s) => s.trim()).includes(filters.size)
    );
  }

  if (filters.sortBy === 'price-asc') {
    result.sort((a, b) => a.price_usd - b.price_usd);
  } else if (filters.sortBy === 'price-desc') {
    result.sort((a, b) => b.price_usd - a.price_usd);
  }

  return result;
}

export function getCategoryCount(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}

export function getCategoryGradient(category: string): string {
  const map: Record<string, string> = {
    'T-shirt': 'cat-gradient-tshirt',
    'Shirt': 'cat-gradient-shirt',
    'Hoodie': 'cat-gradient-hoodie',
    'Jacket': 'cat-gradient-jacket',
    'Jeans': 'cat-gradient-jeans',
    'Shorts': 'cat-gradient-shorts',
    'Sweater': 'cat-gradient-sweater',
    'Dress': 'cat-gradient-dress',
    'Skirt': 'cat-gradient-skirt',
  };
  return map[category] || 'cat-gradient-tshirt';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'T-shirt': '👕',
    'Shirt': '👔',
    'Hoodie': '🧥',
    'Jacket': '🧥',
    'Jeans': '👖',
    'Shorts': '🩳',
    'Sweater': '🧶',
    'Dress': '👗',
    'Skirt': '💃',
  };
  return icons[category] || '👕';
}

export function getColorHex(color: string): string {
  const map: Record<string, string> = {
    'Black': '#111111',
    'White': '#f9fafb',
    'Gray': '#9ca3af',
    'Brown': '#92400e',
    'Blue': '#3b82f6',
    'Red': '#ef4444',
    'Green': '#22c55e',
    'Beige': '#d4a574',
  };
  return map[color] || '#9ca3af';
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

const PRODUCT_IMAGES: Record<string, string[]> = {
  'T-shirt': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop',
  ],
  'Shirt': [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop',
  ],
  'Hoodie': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609873814058-a8928924184a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
  ],
  'Jacket': [
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
  ],
  'Jeans': [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582552938357-32b906df43c3?q=80&w=600&auto=format&fit=crop',
  ],
  'Shorts': [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584273143981-44c210f24e2d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop',
  ],
  'Sweater': [
    'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608063615781-e5ef8bc03111?q=80&w=600&auto=format&fit=crop',
  ],
  'Dress': [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
  ],
  'Skirt': [
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508427953056-b00b8d78ecf5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=600&auto=format&fit=crop',
  ],
};

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  'T-shirt': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop',
  'Shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&auto=format&fit=crop',
  'Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop',
  'Jacket': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400&auto=format&fit=crop',
  'Jeans': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop',
  'Shorts': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400&auto=format&fit=crop',
  'Sweater': 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=400&auto=format&fit=crop',
  'Dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop',
  'Skirt': 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=400&auto=format&fit=crop',
};

export function getProductImage(product: Product): string {
  const images = PRODUCT_IMAGES[product.category] || PRODUCT_IMAGES['T-shirt'];
  let hash = 0;
  for (let i = 0; i < product.product_id.length; i++) {
    hash = product.product_id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % images.length;
  return images[index];
}

export function getCategoryBackgroundImage(category: string): string {
  return CATEGORY_BACKGROUNDS[category] || CATEGORY_BACKGROUNDS['T-shirt'];
}
