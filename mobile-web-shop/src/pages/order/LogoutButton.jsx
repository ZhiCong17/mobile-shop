import { Button } from '@/components/ui/button';
import { useUserStore } from '../../store';

const logout = useUserStore.getState().logout;

function LogoutButton() {
  return (
    <Button onClick={logout}>Logout</Button>
  );
}

export default LogoutButton;
