import validateUser from './validateUser';
import addUser from './addUser';

export default [
  {
    url: '/api/add-user',
    method: 'post',
    response: ({ body }) => {
      const result = addUser(body);

      return {
        status: result.status,
        data: result
      }
    }
  },
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const result = validateUser(body);

      return {
        status: result.status,
        data: result
      }
    }
  }
]
