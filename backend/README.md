# BlueMoon Travel - MERN Backend

This is the backend API for the BlueMoon Travel booking platform built with Node.js, Express, and MongoDB.

## Project Structure

```
backend/
├── config/           # Configuration files (database, environment)
├── models/           # Mongoose models (User, Destination, Booking)
├── controllers/      # Controller logic for each model
├── routes/           # Express routes
├── middleware/       # Custom middleware (authentication, etc.)
└── server.js         # Main server file
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bluemoon-travel
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

## Available Scripts

### Development Mode
```bash
npm run dev
```
Starts the server with nodemon (auto-reload on file changes)

### Production Mode
```bash
npm start
```
Starts the server normally

## API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get a single destination
- `POST /api/destinations` - Create a new destination
- `PUT /api/destinations/:id` - Update a destination
- `DELETE /api/destinations/:id` - Delete a destination

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get a single booking
- `GET /api/bookings/user/:userId` - Get bookings for a user
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `PUT /api/bookings/:id/cancel` - Cancel a booking
- `DELETE /api/bookings/:id` - Delete a booking

### Health Check
- `GET /api/health` - Check if server is running

## Models

### User
- name, email, password, phone, address, profileImage, isAdmin, timestamps

### Destination
- name, description, country, city, price, duration, image, rating, highlights, activities, bestTimeToVisit, maxGroupSize, isAvailable, timestamps

### Booking
- userId, destinationId, startDate, endDate, numberOfTravelers, totalPrice, status, specialRequests, paymentStatus, paymentMethod, timestamps

## Next Steps

1. Uncomment route imports in `server.js` once you're ready to use them
2. Implement User authentication routes and controller
3. Add middleware for protected routes
4. Implement payment integration
5. Add input validation for all endpoints
6. Set up error handling and logging

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
