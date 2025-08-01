import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useGetFeaturedProductsQuery } from "@/features/Api/productApi";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetFeaturedProductsQuery();
  const featuredItems = data?.products || [];
  console.log(featuredItems);

  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const nextItem = () => {
    setCurrentItemIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const prevItem = () => {
    setCurrentItemIndex(
      (prev) => (prev - 1 + featuredItems.length) % featuredItems.length
    );
  };

  const goToItem = (index) => {
    setCurrentItemIndex(index);
  };

  const currentItem = featuredItems[currentItemIndex];

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
    <div className="w-full h-[500px] md:h-[600px] flex">
      {/* Left Side - Static Content */}
      <div className="w-1/3 md:flex-1 bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col justify-center items-start px-3 md:px-8 lg:px-16 py-6 md:py-0 space-y-3 md:space-y-6 relative">
        {/* Decorative background elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 left-5 w-20 h-20 bg-blue-100 rounded-full opacity-30 blur-lg"></div>

        <div className="relative z-10">
          <p className="uppercase tracking-[0.2em] text-xs md:text-sm text-gray-600 border-l-4 border-pink-400 pl-4 font-medium">
            Our Bestsellers
          </p>

          <h1 className="text-lg md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mt-2 md:mt-4">
            Latest
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Arrivals
            </span>
          </h1>

          {/* Hide description text on mobile */}
          <p className="hidden md:block text-gray-600 text-lg mt-4 max-w-md leading-relaxed">
            Discover our curated collection of premium fashion pieces designed
            for the modern lifestyle.
          </p>

          <div className="flex gap-2 md:gap-4 mt-3 md:mt-8">
            <Button
              onClick={() => navigate("/collection")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 md:px-8 py-1.5 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs md:text-base"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Carousel */}
      <div className="w-2/3 md:flex-1 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 via-transparent to-purple-200/20"></div>

        {/* Navigation Buttons */}
        <button
          onClick={prevItem}
          className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-pink-600 p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <ChevronLeft size={16} className="md:w-5 md:h-5" />
        </button>

        <button
          onClick={nextItem}
          className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-pink-600 p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <ChevronRight size={16} className="md:w-5 md:h-5" />
        </button>

        {/* Main Item Card */}
        <div
          className="relative z-10 w-full max-w-xs md:max-w-sm mx-4 md:mx-8"
          onClick={() => navigate(`/product/${currentItem._id}`)}
        >
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] mb-4 md:mb-6">
              <img
                src={currentItem?.photoUrl}
                alt={currentItem?.name}
                className="w-full h-full object-cover object-center transition-transform duration-700"
              />
            </div>

            {/* Item Info */}
            <div className="space-y-2 md:space-y-3">
              <h3 className="font-bold text-gray-900 text-lg md:text-xl">
                {currentItem?.name}
              </h3>
              <p className="text-pink-600 font-bold text-xl md:text-2xl">
                Rs.{currentItem?.price}
              </p>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToItem(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentItemIndex
                  ? "bg-pink-500 w-6 md:w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Floating decorative elements - Hide on mobile */}
        <div className="hidden md:block absolute bottom-20 right-20 w-6 h-6 bg-pink-300 rounded-full animate-bounce opacity-60"></div>
        <div className="hidden md:block absolute top-32 left-16 w-4 h-4 bg-purple-300 rounded-full animate-pulse opacity-40"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
