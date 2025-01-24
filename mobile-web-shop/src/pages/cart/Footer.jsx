import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

function Footer({ totalAmount, noOfProducts }) {
  return (
    <footer className='fixed bottom-0 flex items-center h-[72px] mt-4 z-50 bg-white w-full py-2 shadow-[0_-4px_6px_0_rgba(0,0,0,0.05)]'>
      <Checkbox className='w-4 h-4 ml-5 mr-3' />
      <p>All</p>
      <p className='ml-auto'>Total: ${totalAmount}</p>
      <Button className='ml-3 mr-5'>Checkout ({noOfProducts})</Button>
    </footer>
  );
}

export default Footer;
