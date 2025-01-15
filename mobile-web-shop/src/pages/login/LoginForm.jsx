import { useState } from 'react';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Email and password are required');
      return;
    }

    const loginData = { email, password };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })

      const data = await response.json();

      if (response.ok) {
        console.log(data);
      } else {
        console.error('Error:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error during login. Please try again later.');
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
