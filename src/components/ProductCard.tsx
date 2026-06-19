import type { Product } from '../types/product';
import { getProductImage, getColorHex, formatPrice } from '../utils/product';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAskAI: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView, onAskAI }: ProductCardProps) {
  const imageUrl = getProductImage(product);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#39ff94]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-52 sm:h-56 bg-gray-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Brand badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-800 shadow-sm z-10">
          {product.brand}
        </div>

        {/* Color indicator */}
        <div
          className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white shadow-md z-10"
          style={{ background: getColorHex(product.color) }}
          title={product.color}
        />

        {/* Hover overlay and quick actions */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 z-20">
          <div className="flex gap-2 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 py-2 text-xs font-semibold bg-white text-[#111] rounded-xl hover:bg-[#39ff94] hover:text-[#111] transition-all shadow-md cursor-pointer"
            >
              Xem nhanh
            </button>
            <button
              onClick={() => onAskAI(product)}
              className="py-2 px-3 text-xs font-semibold bg-[#39ff94] text-[#111] rounded-xl hover:bg-[#39ff94]/85 transition-all shadow-md cursor-pointer"
              title="Hỏi AI về sản phẩm này"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Category tag */}
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          {product.category} • {product.season}
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-sm text-[#111] leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.product_name}
        </h3>

        {/* Material & Color */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>{product.material}</span>
          <span className="text-gray-300">|</span>
          <span>{product.color}</span>
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.size_available.split(',').map((s) => s.trim()).map((size) => (
            <span
              key={size}
              className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              {size}
            </span>
          ))}
        </div>

        {/* Price and Action trigger */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <div className="text-lg font-bold text-[#111]">
            {formatPrice(product.price_usd)}
          </div>
          {/* A small arrow icon on hover */}
          <div className="w-6 h-6 rounded-full bg-gray-50 group-hover:bg-[#39ff94] flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#111] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
