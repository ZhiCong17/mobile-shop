import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // const signUpData = { email, password };

    // try {
    //   const response = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(loginData),
    //   })

    //   const result = await response.json();

    //   if (result.data.status === 200) {
    //     console.log('Login successful:', result.data);

    //     const user = result.data.user;

    //     login(user);
    //     navigate('/');
    //   } else {
    //     console.error('Error:', result.data.message);
    //     alert(result.data.message);
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('There was an error during login. Please try again later.');
    // }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className='font-bold mb-1' htmlFor='email'>Email</label>
      <input className='mb-5 pl-3 h-10 border border-neutral-500 rounded w-full' type='email' value={email} name='email' id='email' autoComplete='email' placeholder='me@example.com' onChange={e => setEmail(e.target.value)} />
      <label className='font-bold mb-1' htmlFor='password'>Password</label>
      <input className='mb-5 pl-3 h-10 border border-neutral-500 rounded w-full' type='password' value={password} name='password' id='password' placeholder='********' onChange={e => setPassword(e.target.value)} />
      <label className='font-bold mb-1' htmlFor='confirmPassword'>Confirm Password</label>
      <input className='mb-5 pl-3 h-10 border border-neutral-500 rounded w-full' type='password' value={confirmPassword} name='confirmPassword' id='confirmPassword' placeholder='********' onChange={e => setConfirmPassword(e.target.value)} />
      <Button className='w-full' type='submit'>Sign Up</Button>
    </form>
  )
}

export default SignUpForm;
