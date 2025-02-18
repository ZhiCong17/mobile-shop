import { ToastAction } from '@/components/ui/toast';

export function showToast({toast, description, timeout = 3000, variant = 'default', action = null}) {
  const toastId = toast({
    variant,
    description,
    action
  })

  setTimeout(() => toastId.dismiss(), timeout);
  return;
}

export function createToastAction({ className, altText, onClick }) {
  return <ToastAction className={className} altText={altText} onClick={onClick}>{altText}</ToastAction>;
}
