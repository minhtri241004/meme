const policies = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Đổi trả dễ dàng',
    description: 'Tra cứu thông tin sản phẩm đầy đủ trước khi quyết định mua hàng.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Tư vấn bằng AI',
    description: 'Trợ lý AI thông minh giúp bạn tìm outfit phù hợp theo nhu cầu cá nhân.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
    title: 'Lọc sản phẩm nhanh',
    description: 'Tìm kiếm và lọc theo chất liệu, màu sắc, size, thương hiệu trong vài giây.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Thông tin chất liệu rõ ràng',
    description: 'Mỗi sản phẩm đều có mô tả chi tiết về chất liệu và hướng dẫn bảo quản.',
  },
];

export default function BenefitSection() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#111] mb-3">Tại sao chọn chúng tôi?</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Trải nghiệm mua sắm thông minh với dữ liệu sản phẩm chi tiết và AI tư vấn
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {policies.map((p, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#39ff94]/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-[#39ff94]/15 text-[#111] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#39ff94]/30 transition-colors">
                {p.icon}
              </div>
              <h3 className="font-semibold text-[#111] mb-2">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
