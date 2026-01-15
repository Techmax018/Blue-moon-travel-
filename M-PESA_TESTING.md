# M-Pesa Payment Testing Guide

## Test Phone Number
**0786493506** - Your M-Pesa test phone number

## Step 1: Start the Server

Open a terminal and run:
```bash
npm run dev
```

Wait for this message:
```
Server is running on port 5000
Environment: development
MongoDB connected successfully
```

## Step 2: Create a Test Destination

```bash
curl -X POST http://localhost:5000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kenya Safari",
    "description": "Experience the African wildlife",
    "country": "Kenya",
    "city": "Nairobi",
    "price": 5000,
    "duration": 5,
    "image": "safari.jpg",
    "rating": 5,
    "highlights": ["Wildlife viewing", "Game drives"],
    "activities": ["Photography", "Nature walks"],
    "bestTimeToVisit": "July-October",
    "maxGroupSize": 15,
    "isAvailable": true
  }'
```

**Save the returned `_id` value** - you'll need it for the next step.

Example response:
```json
{
  "success": true,
  "message": "Destination created successfully",
  "data": {
    "_id": "67a8c1f2e3b5c4d0a8f9e2b1",
    "name": "Kenya Safari",
    ...
  }
}
```

## Step 3: Create a Test Booking

Replace `DEST_ID` with the destination ID from Step 2:

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "destinationId": "DEST_ID",
    "startDate": "2024-03-01",
    "endDate": "2024-03-06",
    "numberOfTravelers": 2,
    "totalPrice": 10000
  }'
```

**Save the returned booking `_id`** - you'll use this for payment.

Example response:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "67a8c1f2e3b5c4d0a8f9e2b2",
    "userId": "test_user_123",
    ...
  }
}
```

## Step 4: Initiate M-Pesa Payment

Replace `BOOKING_ID` with the booking ID from Step 3:

```bash
curl -X POST http://localhost:5000/api/mpesa/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0786493506",
    "amount": 10000,
    "bookingId": "BOOKING_ID",
    "userId": "test_user_123",
    "destinationName": "Kenya Safari"
  }'
```

**Expected Response:**
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

## Step 5: Complete Payment

In **sandbox mode**, you should see a payment prompt on your phone (0786493506).

**For actual testing:**
1. You'll receive an M-Pesa STK Push on your phone
2. Enter your M-Pesa PIN to complete payment
3. Payment will be processed

## Step 6: Check Payment Status

Replace `BOOKING_ID` with your booking ID:

```bash
curl http://localhost:5000/api/mpesa/status/BOOKING_ID
```

**Response will show:**
```json
{
  "success": true,
  "data": {
    "status": "succeeded|pending|failed",
    "amount": 10000,
    "transactionId": "MPesa receipt number",
    "createdAt": "timestamp"
  }
}
```

## Full Test Sequence (Copy & Paste)

### Create Destination and Get ID:
```bash
DEST_RESPONSE=$(curl -s -X POST http://localhost:5000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kenya Safari",
    "description": "Experience the African wildlife",
    "country": "Kenya",
    "city": "Nairobi",
    "price": 5000,
    "duration": 5,
    "image": "safari.jpg",
    "rating": 5,
    "highlights": ["Wildlife viewing", "Game drives"],
    "activities": ["Photography", "Nature walks"],
    "bestTimeToVisit": "July-October",
    "maxGroupSize": 15,
    "isAvailable": true
  }')

DEST_ID=$(echo $DEST_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])")
echo "Destination ID: $DEST_ID"
```

### Create Booking and Get ID:
```bash
BOOKING_RESPONSE=$(curl -s -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"test_user_123\",
    \"destinationId\": \"$DEST_ID\",
    \"startDate\": \"2024-03-01\",
    \"endDate\": \"2024-03-06\",
    \"numberOfTravelers\": 2,
    \"totalPrice\": 10000
  }")

BOOKING_ID=$(echo $BOOKING_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])")
echo "Booking ID: $BOOKING_ID"
```

### Initiate Payment:
```bash
curl -s -X POST http://localhost:5000/api/mpesa/initiate \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneNumber\": \"0786493506\",
    \"amount\": 10000,
    \"bookingId\": \"$BOOKING_ID\",
    \"userId\": \"test_user_123\",
    \"destinationName\": \"Kenya Safari\"
  }" | python3 -m json.tool
```

## Troubleshooting

**"Invalid booking ID" error:**
- Make sure you're using a valid MongoDB ObjectID from Step 2
- ObjectID should be 24 characters long

**"Phone number validation failed":**
- Use format: `0786493506` or `254786493506`
- Must start with 07, 01, or 254

**"Connection refused":**
- Make sure server is running: `npm run dev`
- Check it's on port 5000

**"M-Pesa credentials error":**
- Verify your `.env` file has correct:
  - MPESA_CONSUMER_KEY
  - MPESA_CONSUMER_SECRET
  - MPESA_PASSKEY
  - MPESA_SHORTCODE

## Next: Frontend Integration

Once testing is complete, integrate into your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="mpesa.js"></script>

<script>
// After booking is created, trigger payment modal
mpesaPaymentHandler.openPaymentModal({
  bookingId: 'booking_id_from_api',
  userId: 'user_id',
  destinationName: 'Kenya Safari',
  startDate: '2024-03-01',
  endDate: '2024-03-06',
  numberOfTravelers: 2,
  totalPrice: 10000
});
</script>
```

---

**Your M-Pesa integration is ready for testing!** 🎉
