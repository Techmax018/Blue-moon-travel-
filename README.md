🌙 Bluemoon Travel and Booking
Bluemoon Travel and Booking is a comprehensive Node.js platform designed to streamline the travel experience. From browsing destinations to secure, instant payments via M-Pesa, this project handles the full lifecycle of a travel reservation.

🚀 Core Functionalities
Booking Engine: Frontend interface for selecting travel dates, destinations, and packages.

M-Pesa Checkout: Seamless Lipa Na M-Pesa integration for instant booking confirmation.

Automated Bot: A notification bot (Telegram/WhatsApp) that alerts the admin of new bookings and sends tickets to customers.

Secure Backend: Robust Node.js API to manage inventory and transaction logs.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (Client-side validation for phone numbers).

Backend: Node.js & Express.

Payments: Safaricom Daraja API (STK Push).

Tools: dotenv (security), axios (API requests), nodemon (development).

📲 M-Pesa Integration Flow for Bluemoon
To ensure a "Bluemoon" customer has a smooth experience, the integration follows this workflow:

Selection: User selects a travel package (e.g., Mombasa Gateway - Ksh 15,000).

Prompt: User enters their M-Pesa phone number.

STK Push: The server triggers a secure pop-up on the user's phone.

Validation: Once the user enters their PIN, Safaricom sends a ResultCode: 0 to our Callback URL.

Confirmation: The Bluemoon Bot automatically sends a booking confirmation message to the user.

📂 Project Organization
Plaintext

bluemoon-travel/
├── public/              # Frontend (Travel landing page, booking forms)
├── routes/              # API Routes (M-Pesa, Booking, User)
├── bot/                 # Bot logic for notifications
├── services/            # M-Pesa logic (Token generation, STK Push)
├── .env                 # API Keys (Consumer Key, Secret, Shortcode)
├── server.js            # Main entry point
└── mpesa_guide.md       # Your step-by-step integration guide
🚦 Getting Started
Clone and Install:

Bash

npm install
Configure Environment: Create a .env file and add your Daraja credentials (see mpesa_guide.md for details).

Expose Localhost: Since Safaricom needs to talk to your server, run:

Bash

ngrok http 3000
Launch:

Bash

node server.js
