import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Payment from './Payment';

const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useApp();
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      updateCartQuantity(productId, item.quantity + change);
    }
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setOrderSuccess(true);
    // Show success message
    setTimeout(() => {
      setOrderSuccess(false);
    }, 5000);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-black mb-2">Your cart is empty</h2>
        <p className="text-black/70">Browse our products and add items to your cart</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('cart')} ({cart.length} items)</h2>
          <button
            onClick={clearCart}
            className="text-red-700 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-black">{item.product.name}</h3>
                <p className="text-black/90 text-sm">{item.product.category}</p>
                <p className="text-black-400 font-semibold">${item.product.price}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(item.product.id, -1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                
                <span className="text-gray-700 font-semibold min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.product.id, 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <Plus size={16} />
                </button>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="w-8 h-8 bg-red-500/40 rounded-full flex items-center justify-center text-red-300 hover:bg-red-500/90 transition-colors ml-4"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="text-right">
                <p className="text-black font-semibold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-black mb-4">Order Summary</h3>
        
        <div className="space-y-2 mb-4">
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
              <span>{t('total')}</span>
              <span>${(total + 5.99 + (total * 0.08)).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <CreditCard size={20} />
          <span>Proceed to {t('checkout')}</span>
        </button>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <Payment
          cart={cart}
          total={total}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

      {/* Order Success Notification */}
      {orderSuccess && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <CreditCard size={16} />
          </div>
          <div>
            <h4 className="font-semibold">Order Placed Successfully!</h4>
            <p className="text-sm opacity-90">Your order has been confirmed and will be processed soon.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;