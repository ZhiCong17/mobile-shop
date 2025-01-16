import users from './data/users.json' assert { type: 'json' };
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
      const latestUserId = users.reduce((maxId, user) => {
        return user.id ? Math.max(maxId, user.id) : maxId;
      }, 1);
      const newUser = { id: latestUserId + 1, email: userData.email, password: userData.password };
      const updatedUsers = [...users, newUser];

      fs.writeFileSync('./mock/data/users.json', JSON.stringify(updatedUsers, null, 2));

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
