import React, { useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/features/Api/productApi";
import { toast } from "sonner";

const ListItems = () => {
  const { data, refetch } = useGetAllProductsQuery();
  const [deleteProduct, { isSuccess, isError, data: deleteData }] =
    useDeleteProductMutation();
  const items = data?.products;

  const handleDelete = async (productId) => {
    await deleteProduct(productId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(deleteData?.message || "Deletion Successful");
      refetch();
    }

    if (isError) toast.error(deleteData?.message || "Deletion failed");
  }, [isError, isSuccess, deleteData]);
  return (
    <div className="space-y-6 ml-16 md:ml-8 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Product List
        </h1>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-green-50/30 to-teal-50/30 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {items &&
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 md:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  {/* Left side - Product info */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                      {/* Product Name */}
                      <div className="md:col-span-1">
                        <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                          {item.name}
                        </h4>
                      </div>

                      {/* Category - hidden on mobile, shown on desktop */}
                      <div className="hidden md:block">
                        <p className="text-m ml-20 text-gray-900 truncate">
                          {item.category}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="md:text-center">
                        <span className="font-bold text-base md:text-lg text-gray-900">
                          Rs.{item.price}
                        </span>
                      </div>
                    </div>

                    {/* Category shown on mobile only */}
                    <div className="md:hidden mt-1">
                      <p className="text-xs text-gray-600">{item.category}</p>
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item._id)}
                      className="p-2 md:px-3 md:py-2 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span className="hidden sm:inline ml-2">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListItems;
