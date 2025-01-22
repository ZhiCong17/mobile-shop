import users from './data/users.json' with { type: 'json' };
import carts from './data/carts.json' with { type: 'json' };
import fs from 'fs';

function addUser(userData) {
  const emailExists = users.some(user => user.email === userData.email);

  if (emailExists) {
    return {
      status: 409,
      message: 'User with email exists, please use a different email'
    };
  }

  if (userData.email) {
    try {
      // Add new user to users.json
      const latestUserId = getLatestId(users);
      const newUserId = latestUserId + 1;
      const newUser = { id: newUserId, email: userData.email, password: userData.password };
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

export default addUser;

function getLatestId(array) {
  return array.reduce((maxId, item) => {
    return item.id ? Math.max(maxId, item.id) : maxId;
  }, 1);
}
