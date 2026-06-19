import type { Product } from '../types/product';
import { getProductImage, getColorHex, formatPrice } from '../utils/product';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAskAI: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onAskAI }: ProductModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] modal-backdrop flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-content shadow-2xl">
        {/* Header with close */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#111]">Chi tiết sản phẩm</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* Top: Visual + Key Info */}
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {/* Product Image Visual */}
            <div className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden group/modalimg">
              <img
                src={getProductImage(product)}
                alt={product.product_name}
                className="w-full h-full object-cover group-hover/modalimg:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-semibold shadow-sm">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{ background: getColorHex(product.color) }}
                />
                <span className="text-gray-700">{product.color}</span>
              </div>
            </div>

            {/* Key Info */}
            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {product.category} • {product.brand}
              </div>
              <h3 className="text-2xl font-bold text-[#111] mb-2">{product.product_name}</h3>
              <div className="text-3xl font-extrabold text-[#111] mb-4">
                {formatPrice(product.price_usd)}
              </div>

              {/* Quick specs */}
              <div className="space-y-2.5">
                <InfoRow label="Chất liệu" value={product.material} />
                <InfoRow label="Màu sắc" value={product.color} />
                <InfoRow label="Giới tính" value={product.gender} />
                <InfoRow label="Mùa" value={product.season} />
              </div>

              {/* Sizes */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-500 mb-2">Kích thước có sẵn</div>
                <div className="flex flex-wrap gap-2">
                  {product.size_available.split(',').map((s) => s.trim()).map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1.5 text-sm font-semibold bg-gray-50 hover:bg-[#39ff94]/20 text-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h4 className="text-sm font-bold text-[#111] mb-2">Mô tả sản phẩm</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Care Instructions */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-bold text-[#111] mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hướng dẫn bảo quản
            </h4>
            <p className="text-sm text-gray-600">{product.care_instructions}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onAskAI(product)}
              className="flex-1 py-3 px-6 bg-[#39ff94]/15 text-[#111] font-semibold rounded-2xl hover:bg-[#39ff94]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Hỏi AI về sản phẩm này
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 border border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-[#111]">{value}</span>
    </div>
  );
}
