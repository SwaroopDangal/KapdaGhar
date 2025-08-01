import { useGetBestSellersQuery } from "@/features/Api/productApi";
import ProductCard from "./ProductCard";

export default function BestSeller() {
  const { data, isLoading, isError } = useGetBestSellersQuery();
  const bestSellers = data?.products;

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2">
            <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600 font-medium">
              Loading best sellers...
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
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
              Failed to load best sellers. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-100 to-transparent rounded-full blur-3xl opacity-25 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-100 to-transparent rounded-full blur-3xl opacity-20 -translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          {/* Fire decorative elements */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex space-x-1">
              <div className="w-3 h-6 bg-gradient-to-t from-orange-400 to-red-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-4 bg-gradient-to-t from-red-400 to-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-5 bg-gradient-to-t from-orange-500 to-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="flex space-x-1">
              <div
                className="w-3 h-5 bg-gradient-to-t from-orange-500 to-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-4 bg-gradient-to-t from-red-400 to-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="w-3 h-6 bg-gradient-to-t from-orange-400 to-red-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
                Best Sellers
              </h2>
              {/* Animated fire effect behind text */}
              <div className="absolute -top-2 -right-4 text-3xl animate-bounce">
                🔥
              </div>
              <div className="absolute -bottom-1 -left-3 text-2xl animate-pulse opacity-70">
                💫
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl animate-bounce">🏆</span>
              <p className="text-lg md:text-xl text-gray-600 font-medium">
                Customer favorites & top-rated products
              </p>
              <span
                className="text-2xl animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                ⭐
              </span>
            </div>
          </div>

          {/* Hot trending badge */}
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
              <span className="animate-pulse">🔥</span> Hot Trending{" "}
              <span className="animate-pulse">🔥</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative">
          {/* Bestseller ribbon decoration */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-0">
            <div className="bg-gradient-to-r from-transparent via-orange-200 to-transparent h-px w-48"></div>
          </div>

          {/* Grid container with enhanced styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 relative z-10">
            {bestSellers?.map((product, index) => (
              <div
                key={product.id}
                className="group relative transform transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animation: "slideInUp 0.7s ease-out forwards",
                }}
              >
                {/* Bestseller badge for first few items */}
                {index < 3 && (
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <span>#{index + 1}</span>
                      <span className="animate-pulse">🔥</span>
                    </div>
                  </div>
                )}

                {/* Glowing effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-red-400/0 to-yellow-400/0 group-hover:from-orange-400/10 group-hover:via-red-400/10 group-hover:to-yellow-400/10 rounded-lg transition-all duration-300 blur-xl"></div>

                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Floating fire elements */}
          <div
            className="absolute top-12 left-8 text-2xl animate-bounce opacity-30"
            style={{ animationDelay: "0s" }}
          >
            🔥
          </div>
          <div className="absolute top-32 right-12 text-xl animate-pulse opacity-40">
            💥
          </div>
          <div
            className="absolute bottom-20 left-1/3 text-lg animate-bounce opacity-25"
            style={{ animationDelay: "1.5s" }}
          >
            ⚡
          </div>
          <div className="absolute bottom-8 right-1/4 text-2xl animate-pulse opacity-35">
            🌟
          </div>
        </div>

        {/* Bottom promotional section */}
        <div className="mt-20 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-400 mt-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-300"></div>
            <span className="text-sm font-medium">
              Loved by thousands of customers
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-red-300"></div>
          </div>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
