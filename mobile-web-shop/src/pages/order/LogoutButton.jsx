import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

import { useNavigate } from 'react-router-dom';

import { useUserStore } from '@/store';

function LogoutButton(props) {
  const { className } = props;
  const { toast } = useToast();
  const logout = useUserStore.getState().logout;
  const navigate = useNavigate();

  const handleLogoutButtonClick = () => {
    toast({
      variant: 'destructive',
      description: 'Are you sure you want to log out?',
      action: (
        <div className='flex flex-col gap-2'>
          <ToastAction className='bg-slate-400 w-auto' altText='Confirm' onClick={handleLogOut}>Confirm</ToastAction>
          <ToastAction className='bg-slate-400' altText='Cancel'>Cancel</ToastAction>
        </div>
      )
    })
  }

  const handleLogOut = () => {
    logout();
    navigate('/');

    const toastId = toast({
      description: 'You have logged out successfully.',
    })

    setTimeout(() => {
      toastId.dismiss();
    }, 2000);
  }

  return (
    <Button className={className} onClick={handleLogoutButtonClick}>Logout</Button>
  );
}

export default LogoutButton;
