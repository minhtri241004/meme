interface HeroProps {
  onExploreClick: () => void;
  onChatOpen: () => void;
}

export default function Hero({ onExploreClick, onChatOpen }: HeroProps) {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#39ff94]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#39ff94]/15 rounded-full text-sm font-medium text-[#111] mb-6">
              <span className="w-2 h-2 bg-[#39ff94] rounded-full animate-pulse" />
              AI-Powered Shopping
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Thời trang dễ phối,{' '}
              <span className="relative">
                <span className="relative z-10">chọn nhanh bằng AI</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#39ff94]/30 -z-0 rounded" />
              </span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              Tìm áo, quần, hoodie, jacket theo chất liệu, màu sắc, mùa mặc và phong cách cá nhân.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 bg-[#111] text-white font-semibold rounded-2xl hover:bg-[#222] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Xem sản phẩm
              </button>
              <button
                onClick={onChatOpen}
                className="px-7 py-3.5 bg-[#39ff94]/15 text-[#111] font-semibold rounded-2xl hover:bg-[#39ff94]/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Hỏi trợ lý AI
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-gray-500">sản phẩm</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold">9</div>
                <div className="text-sm text-gray-500">danh mục</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  AI
                  <span className="w-2 h-2 bg-[#39ff94] rounded-full animate-pulse" />
                </div>
                <div className="text-sm text-gray-500">tư vấn theo nhu cầu</div>
              </div>
            </div>
          </div>

          {/* Right: Visual Collage */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[480px]">
              {/* Main card */}
              <div 
                className="absolute top-8 left-8 w-56 h-72 rounded-3xl overflow-hidden shadow-2xl animate-float p-6 flex flex-col justify-between bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%), url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop')` }}
              >
                <div>
                  <div className="w-10 h-10 bg-[#39ff94]/20 backdrop-blur-md border border-[#39ff94]/30 rounded-xl mb-4 flex items-center justify-center text-lg">
                    👕
                  </div>
                  <div className="text-white font-bold text-base tracking-wide">T-Shirt Collection</div>
                  <div className="text-gray-300 text-xs mt-1 font-medium">Cotton • Polyester</div>
                </div>
                <div className="text-[#39ff94] font-extrabold text-xl">$29.99</div>
              </div>

              {/* Secondary card */}
              <div 
                className="absolute top-0 right-4 w-48 h-60 rounded-3xl overflow-hidden shadow-xl animate-float-delay p-5 flex flex-col justify-between bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%), url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop')` }}
              >
                <div>
                  <div className="w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mb-3 flex items-center justify-center text-lg">
                    🧥
                  </div>
                  <div className="text-white font-bold text-sm tracking-wide">Hoodie Season</div>
                  <div className="text-gray-300 text-xs mt-0.5 font-medium">Winter • All-season</div>
                </div>
                <div className="text-white font-extrabold text-lg">$79.00</div>
              </div>

              {/* Third card */}
              <div 
                className="absolute bottom-4 right-12 w-52 h-48 rounded-3xl overflow-hidden shadow-xl animate-float-slow p-5 flex flex-col justify-between bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%), url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop')` }}
              >
                <div>
                  <div className="w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mb-2 flex items-center justify-center text-lg">
                    👗
                  </div>
                  <div className="text-white font-bold text-sm tracking-wide">Dress & Skirt</div>
                  <div className="text-gray-300 text-xs mt-0.5 font-medium">6 brands available</div>
                </div>
                <div className="flex gap-1.5">
                  {['#111', '#ef4444', '#3b82f6', '#22c55e'].map((c) => (
                    <div key={c} className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-32 left-0 px-4 py-2.5 bg-white rounded-2xl shadow-lg animate-float-delay flex items-center gap-2">
                <div className="w-8 h-8 bg-[#39ff94]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold">AI tìm nhanh</div>
                  <div className="text-[10px] text-gray-400">trong 2 giây</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
