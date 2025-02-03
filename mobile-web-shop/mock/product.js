import fs from 'fs';

export default [
  {
    url: '/api/products',
    method: 'get',
    response: () => {
      try {
        const products = JSON.parse(fs.readFileSync('./mock/data/products.json', 'utf-8'));

        if (products) {
          return {
            status: 200,
            data: products,
          }
         } else {
          return {
            status: 404,
            message: 'Products not found',
          }
        }
      } catch(err) {
        console.error('Error reading file:', err);

        return {
          status: 500,
          message: 'Failed to fetch products',
        }
      }
    }
  },
]
