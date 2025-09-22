# Order Cancellation Guide

## How to Cancel Orders in SoilQ Application

### Step 1: Go to Profile
1. **Login to your account** (if not already logged in)
2. **Click on "Profile"** in the sidebar navigation

### Step 2: Access Order History
1. **Click on the "Order History" tab** (next to "Soil Tests" tab)
2. You should see **2 mock orders** that are created for testing:
   - **Order #SOILQ-1234567890-0001** (Nitrogen Fertilizer) - Status: **pending**
   - **Order #SOILQ-1234567890-0002** (Phosphorus Mix) - Status: **confirmed**

### Step 3: Open Order Details
1. **Click on any order** in the list to open the order details modal
2. You'll see the full order information including:
   - Order items and quantities
   - Shipping address
   - Payment information
   - Order summary with totals

### Step 4: Cancel the Order
1. **Look for the red "Cancel Order" button** at the bottom of the order details modal
2. **Click the "Cancel Order" button**
3. A confirmation dialog will appear asking "Are you sure you want to cancel this order?"
4. **Enter a reason** (optional) in the text area
5. **Click "Cancel Order"** to confirm

### Step 5: See the Result
1. The order will immediately turn **red** with a strikethrough effect
2. A **"CANCELLED" badge** will appear next to the order number
3. The order status will change to "cancelled"
4. All text elements will turn red to indicate cancellation

## 🎯 Visual Guide

```
Profile Page → Order History Tab → Click Order → Click "Cancel Order" Button
```

## ⚠️ Important Notes

- **Only pending and confirmed orders** can be cancelled
- **Shipped, delivered, or already cancelled orders** cannot be cancelled
- The cancel button only appears for orders that can be cancelled
- Changes are saved automatically and persist across page reloads
- Order cancellation is supported in multiple languages (English, Hindi, Telugu)

## 🔧 Troubleshooting

### If You Don't See Orders:
If you don't see any orders in the Order History tab, it means:
1. **You need to login first** - the mock orders are only created when you're logged in
2. **The user authentication might not be working properly**

**Solution:** Try logging in first, then go to Profile → Order History tab, and you should see the 2 mock orders ready for testing!

### If Cancel Button Doesn't Appear:
- Check that the order status is either "pending" or "confirmed"
- Orders with status "shipped", "delivered", or "cancelled" cannot be cancelled

### If Cancellation Doesn't Work:
- Check the browser console (F12) for any error messages
- Ensure you're logged in and the user session is active
- Try refreshing the page and logging in again

## 🌐 Multi-Language Support

The order cancellation feature supports multiple languages:

- **English**: "Cancel Order", "Are you sure you want to cancel this order?"
- **Hindi (हिंदी)**: "ऑर्डर रद्द करें", "क्या आप वाकई इस ऑर्डर को रद्द करना चाहते हैं?"
- **Telugu (తెలుగు)**: "ఆర్డర్ రద్దు చేయండి", "మీరు ఖచ్చితంగా ఈ ఆర్డర్‌ను రద్దు చేయాలనుకుంటున్నారా?"

## 🎨 Visual Features

### Cancelled Order Styling:
- **Red background** (`bg-red-50`) with red borders
- **Strikethrough text** for order number and total amount
- **Red icon** (Package icon changes to red)
- **"CANCELLED" badge** next to the order number
- **Red text** for all order details
- **Red hover effects** for interactive elements

### Order Details Modal:
- **Strikethrough title** when order is cancelled
- **Cancellation notice** with warning icon
- **Red color scheme** throughout the modal
- **No cancel button** for already cancelled orders

## 🔄 State Management

- **Real-time updates**: Order status changes immediately
- **Persistent storage**: Changes saved to localStorage
- **Global state**: Updates reflected across all components
- **Error handling**: Appropriate error messages displayed

## 🧪 Testing

The application includes mock orders for testing:
- **Mock Order 1**: Nitrogen Fertilizer (Status: pending) - Can be cancelled
- **Mock Order 2**: Phosphorus Mix (Status: confirmed) - Can be cancelled

These orders are automatically created when you log in and can be used to test the cancellation functionality.

---

**Note**: This guide is for the SoilQ Comprehensive Soil Quality Analyzer Application. The order cancellation feature is fully implemented and ready for use.
