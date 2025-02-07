import { Button } from '@/components/ui/button';
import { useUserStore } from '../../store';

const logout = useUserStore.getState().logout;

function LogoutButton(props) {
  const { className } = props;

  return (
    <Button className={className} onClick={logout}>Logout</Button>
  );
}

export default LogoutButton;
