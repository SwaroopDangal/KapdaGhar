import React, { useEffect, useRef, useState } from "react";
import {
  PlusCircle,
  XCircle,
  Upload,
  Package,
  Tag,
  DollarSign,
  FileText,
  Image,
  Sparkles,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAddProductMutation } from "@/features/Api/productApi";
import { toast } from "sonner";
import ButtonLoader from "./ButtonLoader";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const AddItem = () => {
  const [addProduct, { data, isLoading, isSuccess, error }] =
    useAddProductMutation();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [input, setInput] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    sizes: [], // array of {size, stock}
  });

  // Open file selector
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle image file change & preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // Generic input change handler
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // Category and SubCategory change handlers
  const selectCategory = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };
  const selectSubCategory = (value) => {
    setInput((prev) => ({ ...prev, subCategory: value }));
  };

  // Add size with default stock = 0 (if not already selected)
  const handleAddSize = (size) => {
    if (!size) return;
    if (input.sizes.find((s) => s.size === size)) return; // already selected

    setInput((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size, stock: 0 }],
    }));
  };

  // Update stock for a given size
  const handleSizeStockChange = (size, newStock) => {
    setInput((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) =>
        s.size === size
          ? { ...s, stock: newStock >= 0 ? parseInt(newStock) : 0 }
          : s
      ),
    }));
  };

  // Remove size from array
  const handleRemoveSize = (size) => {
    setInput((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.size !== size),
    }));
  };

  // Submit form
  const addHandler = async () => {
    if (
      !input.name ||
      !input.price ||
      !input.description ||
      !input.category ||
      !input.subCategory ||
      !imageFile ||
      input.sizes.length === 0
    ) {
      toast.error("Please fill all fields and add at least one size");
      return;
    }

    // Validate stock numbers
    for (const s of input.sizes) {
      if (isNaN(s.stock) || s.stock < 0) {
        toast.error(`Invalid stock for size ${s.size}`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("price", input.price);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("subCategory", input.subCategory);
    formData.append("sizes", JSON.stringify(input.sizes));
    formData.append("photo", imageFile);

    await addProduct(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Product added successfully");
      // Reset form after success
      setInput({
        name: "",
        price: "",
        description: "",
        category: "",
        subCategory: "",
        sizes: [],
      });
      setPreview(null);
      setImageFile(null);
    }
    if (error) {
      toast.error("Error in adding product");
    }
  }, [isSuccess, error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="container mx-auto px-4 py-1 ml-8 md:ml-2 max-w-7xl">
        {/* Header */}
        <div className="mb-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add New Product
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Create and configure your new product listing
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="px-8 py-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column - Product Details */}
              <div className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-800">
                      Product Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter product name..."
                      value={input.name}
                      onChange={changeEventHandler}
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Category
                      </Label>
                      <Select
                        value={input.category}
                        onValueChange={selectCategory}
                      >
                        <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500">
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-50/95 backdrop-blur-sm border-slate-200 shadow-xl">
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                          <SelectItem value="kids">Kids</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Sub Category
                      </Label>
                      <Select
                        value={input.subCategory}
                        onValueChange={selectSubCategory}
                      >
                        <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500">
                          <SelectValue placeholder="Select sub category..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-50/95 backdrop-blur-sm border-slate-200 shadow-xl">
                          <SelectItem value="Topwear">Topwear</SelectItem>
                          <SelectItem value="Bottomwear">Bottomwear</SelectItem>
                          <SelectItem value="Winterwear">Winterwear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Price
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={input.price}
                      onChange={changeEventHandler}
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Sizes Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-indigo-600" />
                    Sizes & Inventory
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Add Sizes
                    </Label>
                    <Select onValueChange={handleAddSize}>
                      <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500">
                        <SelectValue placeholder="Select size to add..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-50/95 backdrop-blur-sm border-slate-200 shadow-xl">
                        {SIZE_OPTIONS.filter(
                          (size) => !input.sizes.some((s) => s.size === size)
                        ).map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Sizes */}
                  {input.sizes.length > 0 && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-slate-700">
                        Size Inventory
                      </Label>
                      <div className="space-y-3">
                        {input.sizes.map(({ size, stock }) => (
                          <div
                            key={size}
                            className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                          >
                            <Badge
                              variant="outline"
                              className="px-3 py-1 text-sm font-medium"
                            >
                              {size}
                            </Badge>
                            <div className="flex-1">
                              <Input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) =>
                                  handleSizeStockChange(size, e.target.value)
                                }
                                placeholder="Stock quantity"
                                className="h-10 border-slate-200"
                              />
                            </div>
                            <Button
                              onClick={() => handleRemoveSize(size)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Image & Description */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Image className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xl font-semibold text-slate-800">
                      Media & Details
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Product Image
                    </Label>
                    <div
                      onClick={handleImageClick}
                      className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 bg-slate-50/50"
                    >
                      {preview ? (
                        <div className="space-y-4">
                          <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto max-h-64 object-contain rounded-xl shadow-lg"
                          />
                          <p className="text-sm text-slate-600">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-slate-700 mb-1">
                              Upload Product Image
                            </p>
                            <p className="text-sm text-slate-500">
                              Click here or drag and drop your image
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={6}
                      value={input.description}
                      onChange={changeEventHandler}
                      placeholder="Write a detailed product description..."
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-1 pt-8 border-t border-slate-200">
              <Button
                onClick={addHandler}
                disabled={isLoading}
                size="lg"
                className="px-12 py-3 h-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <ButtonLoader />
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddItem;
