import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchX, Filter, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { useGetSearchAndFilterQuery } from "@/features/Api/productApi";

const CollectionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryFromUrl = params.get("query") || "";

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const { data, isLoading, isError } = useGetSearchAndFilterQuery({
    searchQuery: queryFromUrl,
    categories: selectedCategories,
    types: selectedTypes,
    sortByPrice: sortBy,
  });
  const products = data?.products;

  const handleClearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    navigate("/collection");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

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
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">All Collections</h1>
        <div className="w-full md:w-48">
          <Select onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-slate-50/95 backdrop-blur-sm border-slate-200 shadow-xl">
              <SelectItem className={"cursor-pointer"} value="relevant">
                Relevant
              </SelectItem>
              <SelectItem className={"cursor-pointer"} value="lowtohigh">
                Price: Low to High
              </SelectItem>
              <SelectItem className={"cursor-pointer"} value="hightolow">
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters */}
        <div className="md:col-span-3 space-y-6">
          {/* Category Filter Box */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Category</h2>
            <div className="space-y-2">
              {["men", "women", "kids"].map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={cat.toLowerCase()}
                    checked={selectedCategories.includes(cat.toLowerCase())}
                    onCheckedChange={() =>
                      handleCategoryChange(cat.toLowerCase())
                    }
                  />
                  <Label htmlFor={cat.toLowerCase()} className="capitalize">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Type Filter Box */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Type</h2>
            <div className="space-y-2">
              {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeChange(type)}
                  />
                  <Label htmlFor={type.toLowerCase()}>{type}</Label>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Product Grid */}
        {products?.length === 0 && (
          <div className="md:col-span-9 flex items-center justify-center p-10">
            <div className="text-center space-y-6 max-w-md">
              {/* Icon with background */}
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <SearchX className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  No items found
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  We couldn't find any items matching your current criteria.
                </p>
              </div>

              {/* Suggestions */}
              <Alert className="text-left">
                <Filter className="h-4 w-4" />
                <AlertDescription>
                  <strong>Try these suggestions:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Adjust or clear your search filters</li>
                    <li>• Use different search keywords</li>
                    <li>• Browse all categories</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Optional action button */}
              <button
                onClick={handleClearAllFilters}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          </div>
        )}

        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products &&
            products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
