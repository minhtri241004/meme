import { useState, useRef } from 'react';
import { CATEGORIES } from '../types/product';

interface HeaderProps {
  onCategoryClick: (category: string) => void;
  onSearchSubmit: (query: string) => void;
  onChatOpen: () => void;
}

export default function Header({ onCategoryClick, onSearchSubmit, onChatOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const navCategories = ['New Arrivals', 'T-shirt', 'Shirt', 'Hoodie', 'Jacket', 'Jeans', 'Shorts'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  const handleNavClick = (item: string) => {
    setMobileMenuOpen(false);
    if (item === 'New Arrivals') {
      document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
    } else if (CATEGORIES.includes(item as typeof CATEGORIES[number])) {
      onCategoryClick(item);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center">
              <span className="text-[#39ff94] font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              MTR Fashion <span className="text-[#39ff94] font-light">RAG</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navCategories.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#111] hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                {item}
              </button>
            ))}
            <button
              onClick={onChatOpen}
              className="px-3 py-2 text-sm font-medium text-[#111] bg-[#39ff94]/20 hover:bg-[#39ff94]/40 rounded-lg transition-all duration-200 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat AI
            </button>
          </nav>

          {/* Search + Cart + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-48 lg:w-56 pl-9 pr-3 py-2 text-sm bg-white/80 border border-gray-200 rounded-xl focus:bg-white focus:border-[#39ff94] focus:ring-4 focus:ring-[#39ff94]/15 hover:border-gray-300 transition-all font-medium text-gray-700 shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Cart Icon (dummy) */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#39ff94] text-[#111] text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 mt-1 animate-slide-up">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-3 mb-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:bg-white focus:border-[#39ff94] focus:ring-4 focus:ring-[#39ff94]/15 hover:border-gray-300 transition-all font-medium text-gray-700 shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            <div className="flex flex-col gap-0.5">
              {navCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-left px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-[#111] hover:bg-gray-100 rounded-lg transition-all"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); onChatOpen(); }}
                className="text-left px-3 py-2.5 text-sm font-medium text-[#111] bg-[#39ff94]/20 hover:bg-[#39ff94]/40 rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat AI
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
