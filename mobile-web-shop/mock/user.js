import validateUser from "./validateUser";

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
      const result = validateUser(body);

      return {
        status: result.status,
        data: result
      }
    }
  }
]
