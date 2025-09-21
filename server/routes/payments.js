const express = require('express');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const router = express.Router();

// Process payment
router.post('/process', async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    // Simulate payment processing
    let paymentResult;
    
    switch (paymentMethod) {
      case 'cod':
        paymentResult = {
          success: true,
          transactionId: `COD-${Date.now()}`,
          message: 'Cash on Delivery confirmed'
        };
        break;
        
      case 'card':
        // Simulate card validation
        if (paymentDetails.cardNumber && paymentDetails.cardNumber.length >= 16) {
          paymentResult = {
            success: true,
            transactionId: `CARD-${Date.now()}`,
            message: 'Payment successful'
          };
        } else {
          paymentResult = {
            success: false,
            message: 'Invalid card details'
          };
        }
        break;
        
      case 'upi':
        // Simulate UPI validation
        if (paymentDetails.upiId && paymentDetails.upiId.includes('@')) {
          paymentResult = {
            success: true,
            transactionId: `UPI-${Date.now()}`,
            message: 'UPI payment successful'
          };
        } else {
          paymentResult = {
            success: false,
            message: 'Invalid UPI ID'
          };
        }
        break;
        
      case 'netbanking':
        paymentResult = {
          success: true,
          transactionId: `NB-${Date.now()}`,
          message: 'Net banking payment successful'
        };
        break;
        
      case 'wallet':
        paymentResult = {
          success: true,
          transactionId: `WALLET-${Date.now()}`,
          message: 'Wallet payment successful'
        };
        break;
        
      default:
        paymentResult = {
          success: false,
          message: 'Invalid payment method'
        };
    }

    if (paymentResult.success) {
      // Update payment record
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'completed',
        gatewayResponse: {
          transactionId: paymentResult.transactionId,
          gateway: paymentMethod,
          responseCode: '00',
          responseMessage: paymentResult.message
        },
        paymentDetails: paymentDetails,
        processedAt: new Date()
      });

      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        status: 'confirmed',
        paymentDetails: {
          transactionId: paymentResult.transactionId,
          paymentGateway: paymentMethod,
          paidAt: new Date()
        }
      });

      res.json({
        success: true,
        transactionId: paymentResult.transactionId,
        message: paymentResult.message
      });
    } else {
      // Update payment record with failure
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
        gatewayResponse: {
          responseCode: '01',
          responseMessage: paymentResult.message
        }
      });

      res.status(400).json({
        success: false,
        message: paymentResult.message
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment details
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('orderId');
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Get user's payments
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId }).populate('orderId').sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Refund payment
router.post('/:id/refund', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, amount } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Only completed payments can be refunded' });
    }

    const refundAmount = amount || payment.amount;
    const refundId = `REF-${Date.now()}`;

    // Update payment with refund details
    await Payment.findByIdAndUpdate(id, {
      status: 'refunded',
      refundDetails: {
        refundId,
        refundAmount,
        refundReason: reason || 'Customer request',
        refundedAt: new Date()
      }
    });

    // Update order status
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'refunded',
      status: 'cancelled'
    });

    res.json({
      success: true,
      refundId,
      refundAmount,
      message: 'Refund processed successfully'
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Refund processing failed' });
  }
});

module.exports = router;
