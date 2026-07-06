export function HeroBanner() {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            专业汽保设备供应商
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
            品质设备，专业服务，让您的汽修事业更高效
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-accent-400 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors shadow-lg"
            >
              查看产品
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/about"
              className="inline-flex items-center px-8 py-3 border-2 border-white/30 hover:border-white/60 text-white font-medium rounded-lg transition-colors"
            >
              关于我们
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
