import ProductDrawer from "./ProductDrawer";
import { Skeleton } from "@/components/ui/skeleton";

import { useState } from "react";

function ProductCard({ product }) {
  const [loading, setLoading] = useState(true);
  const { name, price, image_url: imageUrl } = product;

  const onImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="flex px-4 pb-4 gap-2">
      <div className="w-24 h-24 flex-shrink-0">
        {loading && <Skeleton className="w-full h-full rounded" />}
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full rounded object-cover ${
            loading && "hidden"
          }`}
          onLoad={onImageLoad}
        />
      </div>

      <div className="relative w-full">
        <p className="mt-1 leading-[1.2] font-semibold">{name}</p>

        <div className="absolute bottom-2 left-0 flex justify-between w-full">
          <p className="my-auto">${price}</p>
          <ProductDrawer product={product} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
