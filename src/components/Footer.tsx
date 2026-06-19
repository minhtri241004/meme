export default function Footer() {
  const links = [
    { label: 'About', href: '#' },
    { label: 'Products', href: '#product-explorer' },
    { label: 'AI Assistant', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer className="bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#39ff94] flex items-center justify-center">
                <span className="text-[#111] font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-lg">
                MTR Fashion <span className="text-[#39ff94] font-light">RAG</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Khám phá outfit phù hợp bằng dữ liệu sản phẩm và trợ lý AI. Lọc, tìm và tư vấn thông minh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Liên kết
            </h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#39ff94] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Danh mục
            </h4>
            <ul className="space-y-2.5">
              {['T-shirt', 'Hoodie', 'Jacket', 'Jeans', 'Dress'].map((cat) => (
                <li key={cat}>
                  <a href="#product-explorer" className="text-sm text-gray-400 hover:text-[#39ff94] transition-colors">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter mock */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Cập nhật
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Nhận thông tin sản phẩm mới và ưu đãi đặc biệt.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#39ff94] transition-colors"
              />
              <button className="px-4 py-2 bg-[#39ff94] text-[#111] font-semibold text-sm rounded-xl hover:bg-[#4dff9e] transition-colors shrink-0">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Demo e-commerce landing page powered by RAG product data.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">© 2024 MTR Fashion RAG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
