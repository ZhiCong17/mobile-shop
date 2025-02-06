const sendItemsToOrders = async (sessionId, userId, items) => {
  let status = await getStripePaymentStatus(sessionId);
  console.log('status:', status);

  await fetch ('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, status, userId })
  })
}

export default sendItemsToOrders;

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
