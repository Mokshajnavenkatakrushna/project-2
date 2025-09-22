import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, X, Eye, MapPin, CreditCard, AlertTriangle } from 'lucide-react';
import { Order } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { orderApi } from '../../services/api';

interface OrderHistoryProps {
  orders: Order[];
  onOrderUpdate?: (orderId: string, updates: Partial<Order>) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onOrderUpdate }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const { t } = useLanguage();

  console.log('OrderHistory component rendered with orders:', orders);
  console.log('onOrderUpdate callback:', onOrderUpdate);
  
  // Force re-render when orders change
  useEffect(() => {
    console.log('Orders updated:', orders);
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'confirmed': return 'text-blue-600';
      case 'processing': return 'text-purple-600';
      case 'shipped': return 'text-indigo-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 border-yellow-400/30';
      case 'confirmed': return 'bg-blue-500/20 border-blue-400/30';
      case 'processing': return 'bg-purple-500/20 border-purple-400/30';
      case 'shipped': return 'bg-indigo-500/20 border-indigo-400/30';
      case 'delivered': return 'bg-green-500/20 border-green-400/30';
      case 'cancelled': return 'bg-red-500/20 border-red-400/30';
      default: return 'bg-gray-500/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return X;
      default: return Clock;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'refunded': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery';
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI';
      case 'netbanking': return 'Net Banking';
      case 'wallet': return 'Digital Wallet';
      default: return method;
    }
  };

  const canCancelOrder = (order: Order) => {
    // Orders can only be cancelled if they are pending or confirmed
    const canCancel = order.status === 'pending' || order.status === 'confirmed';
    console.log(`canCancelOrder for order ${order._id} with status ${order.status}:`, canCancel);
    return canCancel;
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    setIsCancelling(true);
    setCancelError('');

    try {
      console.log('Cancelling order:', selectedOrder._id, 'with reason:', cancelReason);
      
      // Check if this is a mock order (starts with 'mock-')
      if (selectedOrder._id.startsWith('mock-')) {
        console.log('This is a mock order, updating locally only');
        // For mock orders, just update locally
        if (onOrderUpdate) {
          console.log('Updating mock order status via callback');
          onOrderUpdate(selectedOrder._id, { status: 'cancelled' });
        }
      } else {
        // For real orders, call the API
        const response = await orderApi.cancelOrder(selectedOrder._id, cancelReason);
        console.log('Cancel order response:', response);
        
        // Update the order status using the callback
        if (onOrderUpdate) {
          console.log('Updating order status via callback');
          onOrderUpdate(selectedOrder._id, { status: 'cancelled' });
        }
      }
      
      // Update the selected order status locally
      selectedOrder.status = 'cancelled';
      
      // Close only the cancel dialog, keep the order details open
      setShowCancelDialog(false);
      setCancelReason('');
      
      // Show success message (you could add a toast notification here)
      alert(`Order ${selectedOrder.orderNumber} has been cancelled successfully!`);
      
    } catch (error: any) {
      console.error('Cancel order error:', error);
      console.error('Error response:', error.response);
      setCancelError(error.response?.data?.message || t('cancelFailed'));
    } finally {
      setIsCancelling(false);
    }
  };

  const openCancelDialog = () => {
    console.log('openCancelDialog called for order:', selectedOrder);
    setShowCancelDialog(true);
    setCancelError('');
    setCancelReason('');
  };

  const closeCancelDialog = () => {
    setShowCancelDialog(false);
    setCancelReason('');
    setCancelError('');
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <Package className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
        <p className="text-gray-500">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Orders List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Order History ({orders.length})</h2>
          <button
            onClick={() => {
              console.log('Test button clicked - forcing order update');
              if (onOrderUpdate && orders.length > 0) {
                onOrderUpdate(orders[0]._id, { status: 'cancelled' });
              }
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Cancel First Order
          </button>
        </div>
        
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div
                key={`${order._id}-${order.status}`}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  order.status === 'cancelled' 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      order.status === 'cancelled' 
                        ? 'bg-red-100' 
                        : 'bg-blue-100'
                    }`}>
                      <Package size={20} className={
                        order.status === 'cancelled' 
                          ? 'text-red-600' 
                          : 'text-blue-600'
                      } />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        order.status === 'cancelled' 
                          ? 'text-red-600 line-through' 
                          : 'text-gray-800'
                      }`}>
                        Order #{order.orderNumber}
                        {order.status === 'cancelled' && (
                          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            {t('cancelled')}
                          </span>
                        )}
                      </h3>
                      <p className={`text-sm ${
                        order.status === 'cancelled' 
                          ? 'text-red-500' 
                          : 'text-gray-600'
                      }`}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatDate(order.createdAt)}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBgColor(order.status)} ${getStatusColor(order.status)}`}>
                          <StatusIcon size={12} className="inline mr-1" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className={`text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      order.status === 'cancelled' 
                        ? 'text-red-600 line-through' 
                        : 'text-gray-800'
                    }`}>
                      ${order.total.toFixed(2)}
                    </p>
                    <p className={`text-sm ${
                      order.status === 'cancelled' 
                        ? 'text-red-500' 
                        : 'text-gray-600'
                    }`}>
                      {formatPaymentMethod(order.paymentMethod)}
                    </p>
                    <button className={`text-sm font-medium mt-1 ${
                      order.status === 'cancelled' 
                        ? 'text-red-600 hover:text-red-800' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${
                  selectedOrder.status === 'cancelled' 
                    ? 'text-red-600 line-through' 
                    : 'text-gray-800'
                }`}>
                  Order Details
                </h2>
                {selectedOrder.status === 'cancelled' && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <X size={16} className="text-red-600" />
                      <span className="text-red-700 font-medium">{t('orderCancelledMessage')}</span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Order #:</span> <span className="text-gray-800">{selectedOrder.orderNumber}</span></p>
                    <p><span className="text-gray-600">Date:</span> <span className="text-gray-800">{formatDate(selectedOrder.createdAt)}</span></p>
                    <p><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Payment Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Method:</span> <span className="text-gray-800">{formatPaymentMethod(selectedOrder.paymentMethod)}</span></p>
                    <p><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </p>
                    {selectedOrder.paymentDetails?.transactionId && (
                      <p><span className="text-gray-600">Transaction ID:</span> <span className="text-gray-800">{selectedOrder.paymentDetails.transactionId}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm border border-gray-200">
                  <p className="font-medium text-gray-800">{selectedOrder.shippingAddress.name}</p>
                  <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="text-gray-600">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                        <p className="text-gray-600 text-sm">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Dialog */}
      {showCancelDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t('cancelOrderTitle')}</h3>
            </div>

            <p className="text-gray-600 mb-4">{t('cancelOrderConfirm')}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('cancelReason')}
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={3}
                placeholder="Enter reason for cancellation..."
              />
            </div>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{cancelError}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeCancelDialog}
                disabled={isCancelling}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <X size={16} />
                    <span>{t('cancelOrder')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
