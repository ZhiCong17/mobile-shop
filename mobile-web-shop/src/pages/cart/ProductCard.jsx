import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

function ProductCard(props) {
  const { item,  handlePlusMinusClick, isSelected, onSelectChange } = props;
  const { name, price, quantity, image } = item;

  return (
    <div className='flex items-center gap-4 pb-4'>
      <Checkbox checked={isSelected} onCheckedChange={onSelectChange} />
      <img className='w-24 h-24 rounded object-cover' src={image} />
      <div className='relative h-24 flex-grow'>
        <p className='mt-2'>{name}</p>
        <div className='absolute bottom-2 left-0 flex justify-between w-full'>
          <p className='my-auto'>${price}</p>
          <div className='flex gap-3'>
            <Button className='w-7 h-7 p-0' onClick={handlePlusMinusClick} variant='outline'>-</Button>
            <span>{quantity}</span>
            <Button className='w-7 h-7 p-0' onClick={handlePlusMinusClick} variant='outline'>+</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard;
