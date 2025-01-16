import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <>
      <Link className='text-blue-500 block mx-5 mt-5' to='/'>Back to Home</Link>
      <div className='px-5 flex justify-center items-center min-h-[calc(100vh-84px)]'>
        <div>
          <h1 className='text-center font-bold text-2xl mb-1'>Login</h1>
          <p className='text-center mb-5'>Enter your email below to login to your account</p>
          <LoginForm />
          <p className='my-5 text-center'>Dont have an account? <Link className='underline underline-offset-4' to='/signup'>Sign up</Link></p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
