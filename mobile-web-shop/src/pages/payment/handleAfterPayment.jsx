const handleAfterPayment = async () => {
  const stripeSessionId = localStorage.getItem('stripeSessionId');
  const checkoutItems = JSON.parse(localStorage.getItem('checkoutItems'));
  const userId = JSON.parse(localStorage.getItem('user')).id;

  if (localStorage.getItem('orderUpdated') === 'true') {
    localStorage.removeItem('stripeSessionId');
    localStorage.removeItem('checkoutItems');
    localStorage.removeItem('orderUpdated');
    return;
  }

  if (!localStorage.getItem('isProcessingOrder')) {
    localStorage.setItem('isProcessingOrder', 'true');
    await sendItemsToOrders(stripeSessionId, userId, checkoutItems);
    await removeItemsFromCart(userId, checkoutItems);
    localStorage.setItem('orderUpdated', 'true');
    localStorage.removeItem('isProcessingOrder');
  }
}

export default handleAfterPayment;

const sendItemsToOrders = async (sessionId, userId, items) => {
  let status = await getStripePaymentStatus(sessionId);

  const response = await fetch ('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, status, userId })
  })

  const result = await response.json();
  const orderData = result.data;

  sessionStorage.setItem('orderData', JSON.stringify(orderData));
}

const removeItemsFromCart = async (userId, items) => {
  try {
    const selectedItems = items.map(item => item.productId);

    const response = await fetch('/api/remove-from-cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        selectedItems
      }),
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

const getStripePaymentStatus = async (sessionId) => {
  try {
    const response = await fetch(`/api/checkout-session-status/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    const result = await response.json();
    const paymentStatus = result.paymentStatus;

    return paymentStatus;
  } catch (err) {
    console.error('Error:', err);
  }
}
