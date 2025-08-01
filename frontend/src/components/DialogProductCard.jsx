import React from "react";

const DialogProductCard = ({ product, onClose }) => {
  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Product information not available</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
      .format(price || 0)
      .replace("₹", "Rs. ");
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg overflow-hidden relative">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {product.photoUrl ? (
          <img
            src={product.photoUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEzNi4xOSAxMDAgMTI1IDExMS4xOSAxMjUgMTI1QzEyNSAxMzguODEgMTM2LjE5IDE1MCAxNTAgMTUwQzE2My44MSAxNTAgMTc1IDEzOC44MSAxNzUgMTI1QzE3NSAxMTEuMTkgMTYzLjgxIDEwMCAxNTAgMTAwWk0xNTAgMTQwQzE0MS43MiAxNDAgMTM1IDEzMy4yOCAxMzUgMTI1QzEzNSAxMTYuNzIgMTQxLjcyIDExMCAxNTAgMTEwQzE1OC4yOCAxMTAgMTY1IDExNi43MiAxNjUgMTI1QzE2NSAxMzMuMjggMTU4LjI4IDE0MCAxNTAgMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAwIDc1SDEwMEM4Ni4xOSA3NSA3NSA4Ni4xOSA3NSAxMDBWMjAwQzc1IDIxMy44MSA4Ni4xOSAyMjUgMTAwIDIyNUgyMDBDMjEzLjgxIDIyNSAyMjUgMjEzLjgxIDIyNSAyMDBWMTAwQzIyNSA4Ni4xOSAyMTMuODEgNzUgMjAwIDc1Wk0yMTUgMjAwQzIxNSAyMDguMjggMjA4LjI4IDIxNSAyMDAgMjE1SDEwMEM5MS43MiAyMTUgODUgMjA4LjI4IDg1IDIwMFYxMDBDODUgOTEuNzIgOTEuNzIgODUgMTAwIDg1SDIwMEMyMDguMjggODUgMjE1IDkxLjcyIDIxNSAxMDBWMjAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg"></div>
              <p className="text-sm text-gray-500">No image</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 leading-tight">
          {product.name || "Unnamed Product"}
        </h2>

        <div className="text-xl sm:text-2xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </div>
      </div>
    </div>
  );
};

export default DialogProductCard;
