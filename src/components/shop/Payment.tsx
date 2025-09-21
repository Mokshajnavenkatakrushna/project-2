import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, Truck, CheckCircle, X, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { orderApi, paymentApi } from '../../services/api';
import { Order } from '../../types';

interface PaymentProps {
  cart: any[];
  total: number;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}

const Payment: React.FC<PaymentProps> = ({ cart, total, onSuccess, onCancel }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const { clearCart, addOrder } = useApp();

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Truck,
      description: 'Pay when your order arrives',
      available: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      available: true
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      available: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'Direct bank transfer',
      available: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'PayPal, Amazon Pay',
      available: true
    }
  ];

  const handlePaymentDetailsChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return false;
    }

    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
      setError('Please fill in all shipping address fields');
      return false;
    }

    if (selectedMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        setError('Please fill in all card details');
        return false;
      }
    }

    if (selectedMethod === 'upi') {
      if (!paymentDetails.upiId) {
        setError('Please enter your UPI ID');
        return false;
      }
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Create order
      const orderData = {
        userId: user?.id,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        subtotal: total,
        shipping: 5.99,
        tax: total * 0.08,
        total: total + 5.99 + (total * 0.08),
        paymentMethod: selectedMethod,
        shippingAddress,
        notes: ''
      };

      console.log('Creating order with data:', orderData);

      const orderResponse = await orderApi.createOrder(orderData);
      console.log('Order response:', orderResponse.data);
      
      const order = orderResponse.data.order;

      // Process payment
      const paymentResponse = await paymentApi.processPayment({
        orderId: order._id,
        paymentMethod: selectedMethod,
        paymentDetails
      });

      console.log('Payment response:', paymentResponse.data);

      if (paymentResponse.data.success) {
        // Add order to profile
        addOrder(order as Order);
        clearCart();
        onSuccess(order._id);
      } else {
        setError(paymentResponse.data.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.response?.data?.error || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-black/80 text-sm font-medium mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber || ''}
                onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate || ''}
                  onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentDetails.cvv || ''}
                  onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label className="block text-black/80 text-sm font-medium mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={paymentDetails.cardholderName || ''}
                onChange={(e) => handlePaymentDetailsChange('cardholderName', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'upi':
        return (
          <div>
            <label className="block text-black/80 text-sm font-medium mb-2">UPI ID</label>
            <input
              type="text"
              placeholder="yourname@paytm"
              value={paymentDetails.upiId || ''}
              onChange={(e) => handlePaymentDetailsChange('upiId', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-black placeholder-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
        );

      case 'netbanking':
        return (
          <div>
            <label className="block text-black/80 text-sm font-medium mb-2">Select Bank</label>
            <select
              value={paymentDetails.bank || ''}
              onChange={(e) => handlePaymentDetailsChange('bank', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="">Select your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="pnb">Punjab National Bank</option>
            </select>
          </div>
        );

      case 'wallet':
        return (
          <div>
            <label className="block text-black/80 text-sm font-medium mb-2">Select Wallet</label>
            <select
              value={paymentDetails.wallet || ''}
              onChange={(e) => handlePaymentDetailsChange('wallet', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="">Select your wallet</option>
              <option value="paypal">PayPal</option>
              <option value="amazonpay">Amazon Pay</option>
              <option value="googlepay">Google Pay</option>
              <option value="phonepe">PhonePe</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Payment & Checkout</h2>
          <button
            onClick={onCancel}
            className="text-black/60 hover:text-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={shippingAddress.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-black/80 text-sm font-medium mb-2">Address</label>
                <textarea
                  value={shippingAddress.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter your state"
                />
              </div>
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">Pincode</label>
                <input
                  type="text"
                  value={shippingAddress.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={24} className="text-black" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{method.name}</h4>
                        <p className="text-black/70 text-sm">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod && selectedMethod !== 'cod' && (
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Payment Details</h3>
              {renderPaymentForm()}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-black mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-black/70">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black/70">
                <span>Shipping</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between text-black/70">
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-black font-bold text-lg">
                  <span>Total</span>
                  <span>${(total + 5.99 + (total * 0.08)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading && <Loader className="animate-spin" size={20} />}
              <span>
                {loading 
                  ? 'Processing...' 
                  : selectedMethod === 'cod' 
                    ? 'Place Order (COD)' 
                    : 'Pay Now'
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;