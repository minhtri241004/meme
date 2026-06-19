import { CATEGORIES } from '../types/product';
import { getCategoryIcon, getCategoryBackgroundImage } from '../utils/product';

interface CategorySectionProps {
  categoryCounts: Record<string, number>;
  onCategoryClick: (category: string) => void;
}

export default function CategorySection({ categoryCounts, onCategoryClick }: CategorySectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#111] mb-3">Danh mục sản phẩm</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Khám phá 9 danh mục thời trang đa dạng, từ áo thun đến váy đầm
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className="group relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] h-32 sm:h-36 flex flex-col justify-end cursor-pointer"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url('${getCategoryBackgroundImage(cat)}')` }}
              />

              {/* Overlay: Gradient tint for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 group-hover:from-black/90 group-hover:via-black/50 transition-colors duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <span className="text-2xl sm:text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">
                  {getCategoryIcon(cat)}
                </span>
                <div className="font-bold text-sm sm:text-base tracking-wide">{cat}</div>
                <div className="text-white/80 text-xs mt-0.5">
                  {categoryCounts[cat] || 0} sản phẩm
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
