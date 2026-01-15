# Frontend & Backend Integration Guide

## Overview
This guide explains how to integrate your React/HTML frontend with the MERN backend and implement Stripe payments.

---

## 1. API Integration Setup

### Include Scripts in Your HTML
Add these to your HTML `<head>`:

```html
<!-- Axios for API calls -->
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>

<!-- Your API Service -->
<script src="api.js"></script>

<!-- Payment Integration -->
<script src="payment.js"></script>

<!-- Stripe -->
<script src="https://js.stripe.com/v3/"></script>
```

---

## 2. Environment Setup

### Backend Configuration

Create `.env` file in root directory:

```env
MONGO_URI=mongodb+srv://maxnjugu078_db_user:password@cluster0.advudjl.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLIC_KEY=pk_test_your_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers > API Keys**
3. Copy your:
   - Secret Key (starts with `sk_`)
   - Publishable Key (starts with `pk_`)
4. For webhooks, go to **Developers > Webhooks** and get the signing secret

---

## 3. Install Dependencies

```bash
# Root directory
npm install

# Backend (if not already installed)
cd backend
npm install stripe
```

---

## 4. API Endpoints Reference

### Destinations
```javascript
// Get all destinations
const destinations = await destinationAPI.getAll();

// Get single destination
const destination = await destinationAPI.getById(destinationId);

// Create destination (admin)
await destinationAPI.create({
  name: "Paris",
  country: "France",
  price: 1500,
  duration: 5,
  // ... other fields
});
```

### Bookings
```javascript
// Create booking
const booking = await bookingAPI.create({
  userId: userId,
  destinationId: destinationId,
  startDate: "2024-06-01",
  endDate: "2024-06-07",
  numberOfTravelers: 2,
  totalPrice: 3000
});

// Get user bookings
const bookings = await bookingAPI.getUserBookings(userId);

// Cancel booking
await bookingAPI.cancel(bookingId);
```

### Payments
```javascript
// Create payment intent
const payment = await paymentAPI.createPaymentIntent(amount, bookingId);

// Confirm payment
const confirmed = await paymentAPI.confirmPayment(paymentIntentId, paymentId);

// Get payment status
const status = await paymentAPI.getPaymentStatus(bookingId);
```

---

## 5. Implementing Booking Flow

### Step 1: Display Destinations
```html
<div id="destinationsList"></div>

<script>
async function loadDestinations() {
  try {
    const destinations = await destinationAPI.getAll();
    const html = destinations.map(dest => `
      <div class="destination-card">
        <h3>${dest.name}</h3>
        <p>${dest.description}</p>
        <p>Price: ${formatCurrency(dest.price)}</p>
        <button onclick="selectDestination('${dest._id}')">
          Book Now
        </button>
      </div>
    `).join('');
    document.getElementById('destinationsList').innerHTML = html;
  } catch (error) {
    console.error('Error loading destinations:', error);
  }
}

loadDestinations();
</script>
```

### Step 2: Create Booking Form
```html
<form onsubmit="submitBooking(event)">
  <input type="hidden" id="destinationId">
  
  <input type="date" id="startDate" required>
  <input type="date" id="endDate" required>
  <input type="number" id="numberOfTravelers" value="1" min="1" required>
  
  <button type="submit">Continue to Payment</button>
</form>

<script>
async function submitBooking(event) {
  event.preventDefault();
  
  try {
    const booking = await bookingAPI.create({
      userId: getCurrentUserId(), // Get from auth
      destinationId: document.getElementById('destinationId').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      numberOfTravelers: parseInt(document.getElementById('numberOfTravelers').value),
      totalPrice: calculateTotalPrice()
    });
    
    // Open payment modal
    openPaymentModal({
      bookingId: booking._id,
      userId: getCurrentUserId(),
      destinationName: getDestinationName(),
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      numberOfTravelers: document.getElementById('numberOfTravelers').value,
      totalPrice: booking.totalPrice
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    alert('Failed to create booking. Please try again.');
  }
}
</script>
```

### Step 3: Payment Processing
```html
<!-- In your booking.html, add: -->
<script src="payment.js"></script>

<!-- When user clicks "Book Now", call: -->
<script>
function proceedToPayment(bookingData) {
  openPaymentModal(bookingData);
}
</script>
```

---

## 6. Authentication (Optional but Recommended)

### Create User Routes
```javascript
// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
```

### Frontend Login
```html
<script>
async function loginUser(email, password) {
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email,
      password
    });
    
    const token = response.data.token;
    setAuthToken(token);
    localStorage.setItem('userId', response.data.userId);
    
    // Redirect to booking
    window.location.href = '/booking.html';
  } catch (error) {
    console.error('Login failed:', error);
  }
}
</script>
```

---

## 7. Error Handling

```javascript
// API calls include error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login.html';
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);
```

---

## 8. Testing the Integration

### 1. Start Backend Server
```bash
npm run dev
```

### 2. Test API Endpoints
```bash
# Get all destinations
curl http://localhost:5000/api/destinations

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "destinationId": "dest_id_here",
    "startDate": "2024-06-01",
    "endDate": "2024-06-07",
    "numberOfTravelers": 2,
    "totalPrice": 3000
  }'
```

### 3. Test Stripe Payments
Use Stripe test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0000 0000 3220

---

## 9. Deployment Checklist

- [ ] Update API_BASE_URL in `api.js` to production URL
- [ ] Update Stripe keys to production keys
- [ ] Enable CORS for production domain in `server.js`
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use HTTPS for all API calls
- [ ] Set up Stripe webhooks for production
- [ ] Test payment flow end-to-end
- [ ] Implement user authentication
- [ ] Add input validation on frontend and backend

---

## 10. Troubleshooting

### CORS Errors
```javascript
// Make sure server.js has:
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

### Payment Intent Errors
- Check Stripe keys are correct
- Verify amount is in valid format (cents)
- Ensure booking exists before creating payment

### API Call Failures
- Check backend is running on correct port
- Verify API_BASE_URL matches backend URL
- Check browser console for detailed error messages

---

## Support Files

- `api.js` - API service with all endpoints
- `payment.js` - Stripe payment integration
- `backend/controllers/paymentController.js` - Payment logic
- `backend/models/Payment.js` - Payment schema
- `backend/routes/paymentRoutes.js` - Payment routes

---

## Next Steps

1. Complete Stripe setup
2. Implement user authentication
3. Connect your existing booking forms to the API
4. Test end-to-end payment flow
5. Deploy to production

For more help, check Stripe documentation: https://stripe.com/docs
