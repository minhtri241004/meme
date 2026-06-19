import { useState, useEffect, useCallback } from 'react';
import type { Product, Filters } from './types/product';
import { loadProducts, getCategoryCount } from './utils/product';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import NewArrivals from './components/NewArrivals';
import CategorySection from './components/CategorySection';
import ProductExplorer from './components/ProductExplorer';
import ProductModal from './components/ProductModal';
import ChatWidget from './components/ChatWidget';
import BenefitSection from './components/BenefitSection';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';

const defaultFilters: Filters = {
  search: '',
  category: '',
  brand: '',
  material: '',
  color: '',
  gender: '',
  season: '',
  size: '',
  sortBy: 'default',
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSuggestion, setChatSuggestion] = useState('');

  useEffect(() => {
    loadProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categoryCounts = getCategoryCount(products);

  const handleCategoryClick = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setTimeout(() => {
      document.getElementById('product-explorer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleSearchSubmit = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setTimeout(() => {
      document.getElementById('product-explorer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleExploreClick = useCallback(() => {
    document.getElementById('product-explorer')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleChatOpen = useCallback(() => {
    setChatOpen(true);
  }, []);

  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleAskAI = useCallback((product: Product) => {
    const msg = `Tư vấn giúp tôi sản phẩm ${product.product_name}, chất liệu ${product.material}, màu ${product.color}, phù hợp mặc khi nào?`;
    setChatSuggestion(msg);
    setChatOpen(true);
    setSelectedProduct(null);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#39ff94] rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        onCategoryClick={handleCategoryClick}
        onSearchSubmit={handleSearchSubmit}
        onChatOpen={handleChatOpen}
      />

      <main>
        <Hero onExploreClick={handleExploreClick} onChatOpen={handleChatOpen} />
        <Marquee />
        
        <ScrollReveal>
          <NewArrivals products={products} onQuickView={handleQuickView} onAskAI={handleAskAI} />
        </ScrollReveal>

        <ScrollReveal>
          <CategorySection categoryCounts={categoryCounts} onCategoryClick={handleCategoryClick} />
        </ScrollReveal>

        <ScrollReveal>
          <ProductExplorer
            products={products}
            filters={filters}
            onFiltersChange={setFilters}
            onQuickView={handleQuickView}
            onAskAI={handleAskAI}
          />
        </ScrollReveal>

        <ScrollReveal>
          <BenefitSection />
        </ScrollReveal>
      </main>

      <Footer />

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAskAI={handleAskAI}
        />
      )}

      {/* Chat Widget */}
      <ChatWidget
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        suggestedMessage={chatSuggestion}
      />
    </div>
  );
}
