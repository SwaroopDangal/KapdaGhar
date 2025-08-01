import { useGetLatestProductsQuery } from "@/features/Api/productApi";
import ProductCard from "./ProductCard";

export default function LatestCollections() {
  const { data, isLoading, isError } = useGetLatestProductsQuery();
  const latestProducts = data?.products;

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2">
            <div className="w-6 h-6 border-3 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600 font-medium">
              Loading latest collections...
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-red-50 rounded-2xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mt-1">
              Failed to load latest collections. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-pink-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-100 to-transparent rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          {/* Decorative line */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-300"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-300"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Latest Collections
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">✨</span>
              <p className="text-lg md:text-xl text-gray-600 font-medium">
                Discover our newest arrivals and trending styles
              </p>
              <span className="text-2xl">✨</span>
            </div>
          </div>

          {/* Subtitle with animated underline */}
          <div className="relative inline-block">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 font-semibold">
              Fresh • Trendy • Exclusive
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative">
          {/* Grid container with enhanced styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {latestProducts?.map((product, index) => (
              <div
                key={product.id}
                className="transform transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Floating elements */}
          <div
            className="absolute -top-8 left-10 w-4 h-4 bg-pink-300 rounded-full animate-bounce opacity-40"
            style={{ animationDelay: "0s" }}
          ></div>
          <div className="absolute top-20 right-16 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
          <div
            className="absolute bottom-16 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-bounce opacity-30"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Bottom decorative section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-sm font-medium">
              More collections coming soon
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
        </div>
      </div>

      {/* CSS Animation Keyframes (add this to your global CSS) */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
