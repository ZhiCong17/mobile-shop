import fs from 'fs';

export default [
  {
    url: '/api/add-to-cart',
    method: 'PUT',
    response: ({ body }) => {
      const { userId, productId, quantity } = body
      const carts = JSON.parse(fs.readFileSync('./mock/data/carts.json', 'utf-8'));
      let updatedCarts = [];

      for (let i = 0; i < carts.length; i++) {
        if (carts[i].userId === userId) {
          const userCart = carts[i];
          const isExistingProduct = userCart.items.find(item => item.productId === productId);

          if (isExistingProduct) {
            updatedCarts.push('existing product');
            break;
          }

          const updatedItems = [...userCart.items, { productId, quantity }];
          updatedCarts.push({ ...userCart, items: updatedItems });
        } else {
          updatedCarts.push(carts[i]);
        }
      }

      if (updatedCarts[updatedCarts.length - 1] === 'existing product') {
        return {
          status: 409,
          message: 'already in cart',
        }
      }

      try {
        fs.writeFileSync('./mock/data/carts.json', JSON.stringify(updatedCarts, null, 2));

        return {
          status: 200,
          message: 'added to cart',
        }
      } catch (err) {
        console.error('Error writing file:', err);

        return {
          status: 500,
          message: 'failed to add to cart',
        }
      }
    }
  },
  {
    url: '/api/edit-cart',
    method: 'POST',
    response: ({ body }) => {
      const { userId, productId, quantity } = body
      const carts = JSON.parse(fs.readFileSync('./mock/data/carts.json', 'utf-8'));
      const userCartIndex = carts.findIndex(cart => cart.userId === userId);

      if (userCartIndex === -1) {
        return {
          status: 404,
          message: 'cart not found',
        }
      }

      const userCart = carts[userCartIndex];
      const productIndex = userCart.items.findIndex(item => item.productId === productId);

      // Update quantity of product in cart
      userCart.items[productIndex].quantity = quantity;

      try {
        fs.writeFileSync('./mock/data/carts.json', JSON.stringify(carts, null, 2));

        return {
          status: 200,
          message: 'added to cart',
        }
      } catch (err) {
        console.error('Error writing file:', err);

        return {
          status: 500,
          message: 'failed to add to cart',
        }
      }
    }
  },
  {
    url: '/api/carts/:userId',
    method: 'GET',
    response: ({ query }) => {
      const { userId } = query;

      try {
        const carts = JSON.parse(fs.readFileSync('./mock/data/carts.json', 'utf-8'));
        const userCart = carts.find(cart => cart.userId === parseInt(userId));
        const productIds = userCart.items.map(item => item.productId);
        const products = JSON.parse(fs.readFileSync('./mock/data/products.json', 'utf-8'));
        const cartItems = products.filter(product => productIds.includes(product.id));
        const cartItemsWithProductInfo = userCart.items.map(item => {
          const product = cartItems.find(product => product.id === item.productId);

          return {
            ...item,
            name: product.name,
            price: product.price,
            image: product.image,
          }
        })

        if (userCart) {
          return {
            status: 200,
            cartItems: cartItemsWithProductInfo,
          }
        } else {
          return {
            status: 404,
            message: 'cart not found',
          }
        }
      } catch(err) {
        console.error('Error reading file:', err);

        return {
          status: 500,
          message: 'failed to fetch cart',
        }
      }
    }
  },
  {
    url: '/api/cart-product-count/:userId',
    method: 'get',
    response: ({ query }) => {
      const { userId } = query;

      try {
        const carts = JSON.parse(fs.readFileSync('./mock/data/carts.json', 'utf-8'));
        const userCart = carts.find(cart => cart.userId === parseInt(userId));
        const productCountInCart = userCart.items.length;

        return {
          status: 200,
          productCountInCart,
        }
      } catch(err) {
        console.error('Error reading file:', err);

        return {
          status: 500,
          message: 'failed to fetch product count in cart',
        }
      }
    }
  },
  {
    url: '/api/remove-from-cart',
    method: 'DELETE',
    response: ({ body }) => {
      const { userId, selectedItems } = body;
      const carts = JSON.parse(fs.readFileSync('./mock/data/carts.json', 'utf-8'));
      const userCartIndex = carts.findIndex(cart => cart.userId === userId);

      if (userCartIndex === -1) {
        return {
          status: 404,
          message: 'cart not found',
        }
      }

      const userCart = carts[userCartIndex];
      const updatedItems = userCart.items.filter(item => !selectedItems.includes(item.productId));
      const updatedCarts = [...carts];
      updatedCarts[userCartIndex].items = updatedItems;

      try {
        fs.writeFileSync('./mock/data/carts.json', JSON.stringify(updatedCarts, null, 2));

        return {
          status: 200,
          message: 'removed from cart',
        }
      } catch (err) {
        console.error('Error writing file:', err);

        return {
          status: 500,
          message: 'failed to remove from cart',
        }
      }
    }
  }
]
