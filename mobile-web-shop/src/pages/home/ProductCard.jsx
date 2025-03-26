import ProductDrawer from "./ProductDrawer";
import { Skeleton } from "@/components/ui/skeleton";

import { useState } from "react";

function ProductCard({ product }) {
  const [loading, setLoading] = useState(true);
  const { name, price, image } = product;

  const onImageLoad = () => {
    setLoading(false);
  };

  return (
    <ProductDrawer product={product}>
      <div className="flex flex-1 mx-4 mb-4 gap-2 border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <div className="w-24 h-24 flex-shrink-0">
          {loading && <Skeleton className="w-full h-full rounded" />}
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover ${loading && "hidden"}`}
            onLoad={onImageLoad}
          />
        </div>

        <div className="relative pr-2 text-left">
          <p className="mt-1 leading-[1.2] font-semibold">{name}</p>
          <p className="absolute bottom-1 left-0">${price}</p>
        </div>
      </div>
    </ProductDrawer>
  );
}

export default ProductCard;
