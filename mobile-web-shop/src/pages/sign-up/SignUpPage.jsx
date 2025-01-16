import SignUpForm from './SignUpForm';
import { Link } from 'react-router-dom';

function SignUpPage() {
  return (
    <>
      <Link className='text-blue-500 block mx-5 mt-5' to='/'>Back to Home</Link>
      <div className='px-5 flex justify-center items-center min-h-[calc(100vh-84px)]'>
        <div>
          <h1 className='text-center font-bold text-2xl mb-1'>Sign Up</h1>
          <p className='text-center mb-5'>Create a free account</p>
          <SignUpForm />
          <p className='my-5 text-center'>Already have an account? <Link className='underline underline-offset-4' to='/login'>Login</Link></p>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
