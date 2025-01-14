import { useState } from 'react';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  }

  return (
    <form action=''>
      <p className='mb-1'>Email</p>
      <input className='mb-5 pl-3 h-10 border border-neutral-500 rounded w-full' type='email' value={email} name='email' autoComplete='email' placeholder='me@example.com' onChange={e => setEmail(e.target.value)} />
      <p className='mb-1'>Password</p>
      <input className='mb-5 pl-3 h-10 border border-neutral-500 rounded w-full' type='password' value={password} name='password' placeholder='********' onChange={e => setPassword(e.target.value)} />
      <Button className='w-full' onClick={handleSubmit}>Login</Button>
    </form>
  )
}

export default LoginForm;
