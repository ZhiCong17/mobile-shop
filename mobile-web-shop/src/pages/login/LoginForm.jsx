import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePathStore } from '@/store';
import { useUserStore } from '@/store';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useUserStore(state => state.login);
  const navigate = useNavigate();
  const returnPath = usePathStore(state => state.returnPath);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        variant: 'destructive',
        description: 'Email and password are required.'
      });
      return;
    }

    const loginData = { email, password };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })

      const result = await response.json();

      if (result.status === 200) {
        const user = result.user;

        login(user);
        navigate(returnPath);
      } else {
        console.error('Error:', result.message);
        toast({
          variant: 'destructive',
          description: result.message
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        description: 'There was an error during login. Please try again later.'
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className='font-bold mb-1' htmlFor='email'>Email</label>
      <input className='mb-5 pl-3 h-10 border border-neutral-500 rounded w-full' type='email' value={email} name='email' id='email' autoComplete='email' placeholder='me@example.com' onChange={e => setEmail(e.target.value)} />
      <label className='font-bold mb-1' htmlFor='password'>Password</label>
      <input className='mb-5 pl-3 h-10 border border-neutral-500 rounded w-full' type='password' value={password} name='password' id='password' placeholder='********' onChange={e => setPassword(e.target.value)} />
      <Button className='w-full' type='submit'>Login</Button>
    </form>
  )
}

export default LoginForm;
