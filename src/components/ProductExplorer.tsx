import { useState, useMemo } from 'react';
import type { Product, Filters } from '../types/product';
import { CATEGORIES, BRANDS, MATERIALS, COLORS, GENDERS, SEASONS, SIZES } from '../types/product';
import { filterProducts, getColorHex } from '../utils/product';
import ProductCard from './ProductCard';

interface ProductExplorerProps {
  products: Product[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onQuickView: (product: Product) => void;
  onAskAI: (product: Product) => void;
}

const ITEMS_PER_PAGE = 16;

export default function ProductExplorer({
  products,
  filters,
  onFiltersChange,
  onQuickView,
  onAskAI,
}: ProductExplorerProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      brand: '',
      material: '',
      color: '',
      gender: '',
      season: '',
      size: '',
      sortBy: 'default',
    });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, val]) => val && key !== 'sortBy' && val !== 'default'
  ).length;

  const FilterSidebar = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
          Tìm kiếm
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Tên, mô tả..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:bg-white focus:border-[#39ff94] focus:ring-4 focus:ring-[#39ff94]/15 hover:border-gray-300 transition-all font-medium text-gray-750 shadow-sm"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <FilterSelect label="Danh mục" value={filters.category} onChange={(v) => updateFilter('category', v)} options={[...CATEGORIES]} />
      <FilterSelect label="Thương hiệu" value={filters.brand} onChange={(v) => updateFilter('brand', v)} options={[...BRANDS]} />
      <FilterSelect label="Chất liệu" value={filters.material} onChange={(v) => updateFilter('material', v)} options={[...MATERIALS]} />
      <FilterSelect label="Giới tính" value={filters.gender} onChange={(v) => updateFilter('gender', v)} options={[...GENDERS]} />
      <FilterSelect label="Mùa" value={filters.season} onChange={(v) => updateFilter('season', v)} options={[...SEASONS]} />

      {/* Colors visual selector */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
          Màu sắc
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('color', '')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              !filters.color
                ? 'bg-[#111] text-white border-[#111]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'
            }`}
          >
            Tất cả
          </button>
          {COLORS.map((c) => {
            const hex = getColorHex(c);
            const isActive = filters.color === c;
            return (
              <button
                key={c}
                onClick={() => updateFilter('color', c)}
                style={{ backgroundColor: hex }}
                title={c}
                className={`w-6.5 h-6.5 rounded-full border transition-all cursor-pointer relative ${
                  isActive
                    ? 'border-[#111] ring-2 ring-[#39ff94] scale-110 shadow-md'
                    : 'border-gray-200 hover:scale-105'
                }`}
              >
                {isActive && (
                  <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${
                    c === 'White' || c === 'Beige' ? 'text-gray-900' : 'text-white'
                  }`}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes visual selector */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
          Kích thước
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateFilter('size', '')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              !filters.size
                ? 'bg-[#111] text-white border-[#111]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'
            }`}
          >
            Tất cả
          </button>
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => updateFilter('size', s)}
              className={`w-8.5 h-8.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                filters.size === s
                  ? 'bg-[#111] text-white border-[#111] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
          Sắp xếp giá
        </label>
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value as Filters['sortBy'])}
            className="w-full py-2.5 pl-3 pr-10 text-sm bg-white border border-gray-200 rounded-xl focus:bg-white focus:border-[#39ff94] focus:ring-4 focus:ring-[#39ff94]/15 hover:border-gray-300 transition-all appearance-none cursor-pointer font-medium text-gray-700 shadow-sm"
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 text-sm font-semibold text-red-500 hover:text-red-650 bg-red-50 hover:bg-red-100/70 rounded-xl transition-all cursor-pointer"
        >
          Xóa bộ lọc ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <section id="product-explorer" className="py-16 px-4 sm:px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#111] mb-2">Khám phá sản phẩm</h2>
            <p className="text-gray-500">
              {filtered.length} sản phẩm được tìm thấy
              {activeFilterCount > 0 && ` • ${activeFilterCount} bộ lọc đang áp dụng`}
            </p>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all self-start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-[#39ff94] text-[#111] text-xs font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm text-[#111] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Bộ lọc
              </h3>
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Panel */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-5 overflow-y-auto animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Bộ lọc</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-[#111] mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#111] text-white rounded-xl hover:bg-[#222] transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {visible.map((product) => (
                    <ProductCard
                      key={product.product_id}
                      product={product}
                      onQuickView={onQuickView}
                      onAskAI={onAskAI}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                      className="px-8 py-3 bg-white border border-gray-200 text-[#111] font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-sm"
                    >
                      Xem thêm ({Math.min(ITEMS_PER_PAGE, filtered.length - visibleCount)} sản phẩm)
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      Đang hiển thị {visible.length} / {filtered.length}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-2.5 pl-3 pr-10 text-sm bg-white border border-gray-200 rounded-xl focus:bg-white focus:border-[#39ff94] focus:ring-4 focus:ring-[#39ff94]/15 hover:border-gray-300 transition-all appearance-none cursor-pointer font-medium text-gray-700 shadow-sm"
        >
          <option value="">Tất cả</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
