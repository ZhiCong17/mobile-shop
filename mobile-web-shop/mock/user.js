import users from './data/userList.js';

export default [
  {
    url: '/api/users',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]
      }
    }
  },
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      return validateUser(body);
    }
  }
]

function validateUser(loginInfo) {
  const user = users.find(user => user.email === loginInfo.email);

  if (user && user.password === loginInfo.password) {
    return {
      code: 200,
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email }
    }
  } else {
    return {
      code: 401,
      message: 'Invalid email or password'
    }
  }
}
