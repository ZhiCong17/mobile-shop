import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useState } from "react";

function ProductCard(props) {
  const { product, handlePlusMinusClick, isSelected, onSelectChange } = props;
  const { name, price, image_url: imageUrl, quantity } = product;
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex items-center gap-3 pb-4">
      <Checkbox checked={isSelected} onCheckedChange={onSelectChange} />

      {loading && <Skeleton className="w-24 h-24 rounded" />}

      <img
        src={imageUrl}
        alt={name}
        className={`w-24 h-24 rounded object-cover ${loading && "hidden"}`}
        onLoad={() => setLoading(false)}
      />

      <div className="relative h-24 flex-grow">
        <p className="mt-2 font-semibold">{name}</p>

        <div className="absolute bottom-2 left-0 flex justify-between w-full">
          <p className="my-auto text-sm">${price}</p>

          <div className="flex gap-3 items-center">
            <Button
              className="w-7 h-7 p-0"
              onClick={handlePlusMinusClick}
              variant="outline"
            >
              -
            </Button>

            <span>{quantity}</span>

            <Button
              className="w-7 h-7 p-0"
              onClick={handlePlusMinusClick}
              variant="outline"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
