import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useState } from "react";

function ProductCard(props) {
  const { product, handlePlusMinusClick, isSelected, onSelectChange } = props;
  const { name, price, image: imageUrl, quantity } = product;
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex items-center gap-2 min-[425px]:gap-6 pb-4">
      <Checkbox checked={isSelected} onCheckedChange={onSelectChange} />

      {loading && <Skeleton className="w-24 h-24 rounded" />}

      <div className="flex w-full max-w-xs border rounded-lg shadow-md overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className={`w-24 h-24 object-cover ${loading && "hidden"}`}
          onLoad={() => setLoading(false)}
        />

        <div className="relative h-24 flex-grow">
          <p className="mt-1 px-2 font-semibold leading-[1.2]">{name}</p>

          <div className="absolute bottom-1 left-0 flex justify-between w-full px-2">
            <p className="my-auto text-sm">${price}</p>

            <div className="flex gap-2 items-center">
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
    </div>
  );
}

export default ProductCard;
