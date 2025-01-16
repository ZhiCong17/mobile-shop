import users from './data/users.json' assert { type: 'json' };

function validateUser(loginInfo) {
  const user = users.find(user => user.email === loginInfo.email);

  if (user && user.password === loginInfo.password) {
    return {
      status: 200,
      message: 'Login successful',
      user: { id: user.id, email: user.email }
    }
  } else {
    return {
      status: 401,
      message: 'Invalid email or password'
    }
  }
}

export default validateUser;
