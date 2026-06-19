export default function Marquee() {
  const items = [
    'NEW DROP',
    'SUMMER FIT',
    'AI SHOPPING ASSISTANT',
    'SMART PRODUCT SEARCH',
    'OVER 1000 ITEMS',
    'FREE STYLE GUIDE',
    '6 LOCAL BRANDS',
    'FILTER BY MATERIAL',
  ];

  return (
    <div className="bg-[#111] text-white py-3 overflow-hidden select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="mx-6 text-sm font-semibold tracking-wider flex items-center gap-3">
            <span className="text-[#39ff94]">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
