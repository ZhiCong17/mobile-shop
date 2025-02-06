import fs from 'fs';

export default [
  {
    url: '/api/add-user',
    method: 'post',
    response: ({ body }) => {
      const result = addUser(body);
      const { status, message } = result;

      return {
        status,
        message
      }
    }
  },
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const result = validateUser(body);
      const { status, message, user = {} } = result;

      return {
        status,
        message,
        user
      }
    }
  }
]

function addUser(userData) {
  const users = JSON.parse(fs.readFileSync('./mock/data/users.json', 'utf8'));
  const carts = JSON.parse(fs.readFileSync('./mock/data/carts.json', 'utf8'));
  const { email, password } = userData;
  const emailExists = users.some(user => user.email === email);

  if (emailExists) {
    return {
      status: 409,
      message: 'User with email exists, please use a different email'
    };
  }

  if (email) {
    try {
      // Add new user to users.json
      const latestUserId = getLatestId(users);
      const newUserId = latestUserId + 1;
      const newUser = { id: newUserId, email, password };
      const updatedUsers = [...users, newUser];

      fs.writeFileSync('./mock/data/users.json', JSON.stringify(updatedUsers, null, 2));

      // Add new cart to carts.json
      const latestCartId = getLatestId(carts);
      const newCart = { id: latestCartId + 1, userId: newUserId, items: [] };
      const updatedCarts = [...carts, newCart];

      fs.writeFileSync('./mock/data/carts.json', JSON.stringify(updatedCarts, null, 2));

      return {
        status: 200,
        message: 'User created, you can now login'
      };
    } catch (err) {
      console.error('Error writing file:', err);

      return {
        status: 500,
        message: 'Failed to register user, please try again'
      };
    }
  }
}

export function getLatestId(array) {
  return array.reduce((maxId, item) => {
    return item.id ? Math.max(maxId, item.id) : maxId;
  }, 0);
}

function validateUser(loginInfo) {
  const users = JSON.parse(fs.readFileSync('./mock/data/users.json', 'utf8'));
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
