const express = require('express');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const { userId, items, subtotal, shipping, tax, total, paymentMethod, shippingAddress, notes } = req.body;

    // Validate required fields
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = new Order({
      userId,
      items,
      subtotal,
      shipping: shipping || 5.99,
      tax,
      total,
      paymentMethod,
      shippingAddress,
      notes: notes || ''
    });

    await order.save();

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId,
      amount: total,
      paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    await payment.save();

    res.status(201).json({
      order,
      payment
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { 
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Order cancelled'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update payment status if not COD
    if (order.paymentMethod !== 'cod') {
      await Payment.findOneAndUpdate(
        { orderId: order._id },
        { status: 'cancelled' }
      );
    }

    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;

