import type { Product } from '../types/product';
import ProductCard from './ProductCard';

interface NewArrivalsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAskAI: (product: Product) => void;
}

export default function NewArrivals({ products, onQuickView, onAskAI }: NewArrivalsProps) {
  const items = products.slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section id="new-arrivals" className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              MỚI
            </div>
            <h2 className="text-3xl font-bold text-[#111]">Hàng mới mở bán</h2>
          </div>
          <a
            href="#product-explorer"
            className="text-sm font-semibold text-gray-500 hover:text-[#111] transition-colors flex items-center gap-1"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onQuickView={onQuickView}
              onAskAI={onAskAI}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
