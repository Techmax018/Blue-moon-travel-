# M-Pesa Daraja API Integration Guide

## Overview
This guide explains how to set up M-Pesa Daraja API for payment processing in your BlueMoon Travel application.

---

## 1. Prerequisites

- Safaricom M-Pesa Merchant Account
- Business registered with Safaricom
- Daraja API credentials
- HTTPS enabled for production (M-Pesa requires HTTPS)

---

## 2. Get M-Pesa Daraja API Credentials

### Step 1: Register on Daraja Platform
1. Go to [Safaricom Daraja](https://developer.safaricom.co.ke/)
2. Create a developer account
3. Verify your email

### Step 2: Create an Application
1. Log in to your Daraja account
2. Go to **My Apps**
3. Click **Create New App**
4. Fill in the details:
   - App Name: `BlueMoon Travel`
   - Description: `Travel booking payment platform`
5. Click **Create**

### Step 3: Get Your Credentials
Once your app is created, you'll see:
- **Consumer Key**
- **Consumer Secret**

Copy these and save them securely.

### Step 4: Get Passkey
1. In your Daraja account, go to **Test Credentials**
2. Under "Lipa Na M-Pesa Online - STK Push", copy the **Passkey**
3. Use the provided **Short Code** (usually 174379 for test)

### Step 5: Add Callback URL
In your Daraja app settings, add your callback URL:
```
https://yourdomain.com/api/mpesa/callback
```

---

## 3. Environment Configuration

Update your `.env` file with M-Pesa credentials:

```env
# M-Pesa Configuration
MPESA_ENV=sandbox                    # Use "production" for live
MPESA_SHORTCODE=174379               # Your business short code
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

### For Production
When going live:
1. Change `MPESA_ENV=production`
2. Update SHORTCODE to your actual business shortcode
3. Use production Consumer Key and Secret
4. Update callback URL to your production domain

---

## 4. API Endpoints

### Initiate M-Pesa Payment
**POST** `/api/mpesa/initiate`

```bash
curl -X POST http://localhost:5000/api/mpesa/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0712345678",
    "amount": 5000,
    "bookingId": "booking_id_here",
    "userId": "user_id_here",
    "destinationName": "Paris"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "M-Pesa payment initiated",
  "data": {
    "paymentId": "payment_id",
    "checkoutRequestId": "checkout_id",
    "responseCode": "0",
    "responseDescription": "Success. Request accepted for processing"
  }
}
```

### Check Payment Status
**GET** `/api/mpesa/status/:bookingId`

```bash
curl http://localhost:5000/api/mpesa/status/booking_id_here
```

### Query Transaction Status
**POST** `/api/mpesa/query`

```bash
curl -X POST http://localhost:5000/api/mpesa/query \
  -H "Content-Type: application/json" \
  -d '{
    "checkoutRequestId": "checkout_request_id"
  }'
```

### Handle Callback (Webhook)
**POST** `/api/mpesa/callback`

This is automatically called by Safaricom when payment is processed.

---

## 5. Frontend Integration

### Step 1: Include Scripts
Add these to your HTML file:

```html
<!-- Axios for API calls -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<!-- M-Pesa JavaScript API -->
<script src="mpesa.js"></script>

<!-- M-Pesa Modal HTML -->
<script src="mpesa-modal.html"></script>

<!-- Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

### Step 2: Trigger Payment Modal

```javascript
// When user clicks "Complete Payment"
const bookingData = {
  bookingId: 'booking_id_here',
  userId: 'user_id_here',
  destinationName: 'Paris Trip',
  startDate: '2024-06-01',
  endDate: '2024-06-07',
  numberOfTravelers: 2,
  totalPrice: 5000  // Amount in KES
};

// Open M-Pesa payment modal
mpesaPaymentHandler.openPaymentModal(bookingData);
```

### Step 3: Complete Booking Form
```html
<form onsubmit="submitBooking(event)">
  <input type="hidden" id="destinationId" value="destination_id">
  
  <label>Start Date:</label>
  <input type="date" id="startDate" required>
  
  <label>End Date:</label>
  <input type="date" id="endDate" required>
  
  <label>Number of Travelers:</label>
  <input type="number" id="numberOfTravelers" value="1" min="1" required>
  
  <button type="submit">Continue to Payment</button>
</form>

<script>
async function submitBooking(event) {
  event.preventDefault();
  
  try {
    // Get destination details
    const destination = await destinationAPI.getById(
      document.getElementById('destinationId').value
    );
    
    // Calculate total price
    const travelers = parseInt(document.getElementById('numberOfTravelers').value);
    const totalPrice = destination.price * travelers;
    
    // Create booking
    const booking = await bookingAPI.create({
      userId: getCurrentUserId(),
      destinationId: destination._id,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      numberOfTravelers: travelers,
      totalPrice: totalPrice
    });
    
    // Open M-Pesa payment modal
    mpesaPaymentHandler.openPaymentModal({
      bookingId: booking._id,
      userId: getCurrentUserId(),
      destinationName: destination.name,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      numberOfTravelers: travelers,
      totalPrice: totalPrice
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to create booking');
  }
}
</script>
```

---

## 6. Testing M-Pesa Integration

### Test Phone Numbers
For sandbox testing, you can use:
- `0712345678` - Test phone number
- `0711111111` - Another test number

### Test Flow
1. Fill in booking form with valid dates
2. Click "Complete Payment"
3. Enter test phone number (e.g., 0712345678)
4. Click "Pay via M-Pesa"
5. In sandbox, payment will auto-complete

### Monitoring Payments
```bash
# Check all M-Pesa payments
curl http://localhost:5000/api/mpesa

# Check specific booking payment status
curl http://localhost:5000/api/mpesa/status/booking_id_here
```

---

## 7. Error Handling

The API returns helpful error messages:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

### Common Errors

| Error | Solution |
|-------|----------|
| Invalid phone number | Use format: 0712345678 or 254712345678 |
| Invalid credentials | Check Consumer Key/Secret in .env |
| Invalid shortcode | Use correct business shortcode |
| Insufficient funds | Test account needs balance |
| HTTPS required | Ensure callback URL uses HTTPS |

---

## 8. Production Deployment

### Checklist
- [ ] Get production Consumer Key and Secret from Safaricom
- [ ] Update MPESA_ENV to "production"
- [ ] Update MPESA_SHORTCODE to your business shortcode
- [ ] Ensure callback URL is HTTPS
- [ ] Test with live shortcode in sandbox first
- [ ] Set up SSL certificate
- [ ] Configure Safaricom IP whitelist
- [ ] Test end-to-end payment flow
- [ ] Monitor payment logs

### Steps to Go Live

1. **Contact Safaricom Business Support**
   - Register your business
   - Get production credentials
   - Get your business shortcode

2. **Update Environment Variables**
   ```env
   MPESA_ENV=production
   MPESA_SHORTCODE=your_business_shortcode
   MPESA_CONSUMER_KEY=production_key
   MPESA_CONSUMER_SECRET=production_secret
   ```

3. **Update Callback URL**
   ```env
   MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
   ```

4. **Enable HTTPS**
   Ensure your domain has valid SSL certificate

5. **Test Payments**
   Use real phone numbers and small amounts

6. **Monitor Transactions**
   Keep logs for all transactions

---

## 9. Phone Number Formats Supported

The API accepts phone numbers in these formats:
- `0712345678` - Kenyan format (auto-converted to 254)
- `254712345678` - International format
- `+254712345678` - International with +

All are automatically normalized to `254712345678` format.

---

## 10. Webhook Security

The callback from Safaricom includes:
- CheckoutRequestID
- ResultCode (0 = success)
- Payment details

### Security Tips
- Verify callback is from Safaricom
- Store transaction IDs for reconciliation
- Implement idempotency checks
- Log all callbacks
- Use HTTPS only

---

## 11. Troubleshooting

### Payment Modal Not Showing
```javascript
// Make sure modal HTML is included
// Check browser console for errors
console.log('M-Pesa Handler:', mpesaPaymentHandler);
```

### Phone Number Validation Fails
- Use format: `0712345678`
- Must start with `07`, `01`, or `254`
- Must have 12 digits total (with 254 prefix)

### Callback Not Received
1. Verify MPESA_CALLBACK_URL is publicly accessible
2. Check firewall allows Safaricom IPs
3. Ensure HTTPS is enabled
4. Check server logs for callback errors

### Payment Status Stuck on "Processing"
- Check booking status in database
- Verify callback was received
- Check Daraja dashboard for transaction status
- Contact Safaricom support if needed

---

## 12. File Reference

| File | Purpose |
|------|---------|
| `backend/controllers/mpesaController.js` | Payment logic |
| `backend/routes/mpesaRoutes.js` | API endpoints |
| `backend/config/mpesa.js` | Configuration |
| `backend/models/Payment.js` | Payment database schema |
| `mpesa.js` | Frontend JavaScript API |
| `mpesa-modal.html` | Payment modal UI |

---

## 13. Useful Resources

- [Safaricom Daraja API Docs](https://developer.safaricom.co.ke/docs)
- [M-Pesa API Documentation](https://developer.safaricom.co.ke/api/index)
- [Safaricom Test Codes](https://developer.safaricom.co.ke/test_credentials)
- [Payment Error Codes](https://developer.safaricom.co.ke/error_codes)

---

## Support

For issues with:
- **M-Pesa Integration**: Check Safaricom Daraja docs
- **Backend Errors**: Check server logs (`npm run dev`)
- **Frontend Issues**: Check browser console
- **Credentials**: Contact Safaricom Business Support

---

## Next Steps

1. Get Daraja API credentials
2. Update `.env` file with credentials
3. Test payment flow in sandbox
4. Deploy to production
5. Monitor transactions

Your M-Pesa integration is ready! 🎉
