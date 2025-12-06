<p align="center">
  <img src="src/assets/logo.png" alt="Flexpay Logo" width="200"/>
</p>

<h1 align="center">Flexpay</h1>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/react--native-0.82.0-blue.svg" alt="React Native">
  <img src="https://img.shields.io/badge/python-3.x-blue.svg" alt="Python">
</p>

Flexpay is a mobile payment application that allows users to send and receive money, manage their finances, and make payments seamlessly. It features a secure authentication system, virtual card management, and QR code payment capabilities. The application is built with a React Native frontend and a Python Flask backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Linting and Testing](#linting-and-testing)
- [API Endpoints](#api-endpoints)

## Features

- **Authentication:** Secure user signup and login with JWT-based authentication.
- **PIN Lock:** Users can set a 4-digit PIN for quick and secure access to the app.
- **Send and Receive Money:** Instantly send money to other Flexpay users.
- **Transaction History:** View a detailed history of all your transactions.
- **Virtual Cards:** Get a virtual Mastercard, Visa, or American Express card for online payments.
- **Card Management:** Freeze, unfreeze, or delete your virtual card.
- **QR Code Payments:**
    - Generate a personal QR code to receive payments.
    - Scan other users' QR codes to send money.
- **Beneficiaries:** Add and manage a list of frequent payees.
- **Profile Management:** Update your personal information and change your password.
- **Push Notifications:** Receive real-time notifications for transactions.

## Tech Stack

### Frontend (Mobile App)

- **React Native:** A framework for building native mobile apps using JavaScript and React.
- **React Navigation:** For routing and navigation between screens.
- **Redux Toolkit:** For state management.
- **React Native Paper:** A library for Material Design components.
- **TypeScript:** For static typing.
- **Jest:** For testing.
- **ESLint:** For linting.

### Backend

- **Python:** A versatile programming language.
- **Flask:** A lightweight web framework for building the API.
- **SQLite:** A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.
- **Faker:** For generating fake data (e.g., credit card numbers).
- **PyJWT:** For encoding and decoding JSON Web Tokens.
- **pyfcm:** For sending push notifications via Firebase Cloud Messaging (FCM).

## Folder Structure

```
Flexpay/
├── backend/
│   ├── app/
│   │   ├── api/         # API blueprints (auth, transactions, etc.)
│   │   ├── __init__.py  # Flask app factory
│   │   └── ...
│   ├── requirements.txt # Python dependencies
│   └── run.py           # Script to run the backend server
├── src/
│   ├── assets/          # Images, fonts, and icons
│   ├── components/      # Reusable UI components
│   ├── navigations/     # React Navigation setup
│   ├── screens/         # Application screens
│   ├── slices/          # Redux slices
│   ├── store/           # Redux store configuration
│   ├── theme/           # App theme and styles
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── App.tsx              # Main app component
├── package.json         # Node.js dependencies and scripts
└── ...
```

## Prerequisites

- Node.js (>=20)
- Python 3.x
- React Native development environment (Android and/or iOS)

## Installation

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**
    - On Windows:
      ```bash
      venv\Scripts\activate
      ```
    - On macOS and Linux:
      ```bash
      source venv/bin/activate
      ```

4.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

### Frontend

1.  **Navigate to the project root directory:**
    ```bash
    cd .. 
    ```

2.  **Install the required Node.js packages:**
    ```bash
    npm install
    ```

## Running the Application

### Backend

1.  **Make sure you are in the `backend` directory with the virtual environment activated.**

2.  **Run the Flask server:**
    ```bash
    flask run
    ```
    The backend server will start on `http://127.0.0.1:5000`.

### Frontend

1.  **Make sure the backend server is running.**

2.  **Run the React Native app:**

    - **For Android:**
      ```bash
      npm run android
      ```

    - **For iOS:**
      ```bash
      cd ios
      pod install
      cd ..
      npm run ios
      ```

## Linting and Testing

### Linting

To check the code for any linting errors, run the following command from the project root directory:

```bash
npm run lint
```

### Testing

To run the test suite, use the following command from the project root directory:

```bash
npm run test
```

## API Endpoints

The backend API provides the following endpoints:

- **Auth**
  - `POST /api/signup`: Create a new user account.
  - `POST /api/login`: Log in an existing user.
  - `POST /api/session/refresh`: Refresh the session token.
- **User**
  - `GET /api/balance`: Get the user's account balance.
  - `GET /api/profile`: Get the user's profile information.
  - `PUT /api/profile/update`: Update the user's profile.
  - `PUT /api/password/change`: Change the user's password.
  - `DELETE /api/account/delete`: Delete the user's account.
  - `GET /api/qr-data`: Get the data for the user's QR code.
  - `POST /api/user/device-token`: Update the user's device token for push notifications.
  - `GET /api/login-pin/check`: Check if the user has a login PIN set.
  - `POST /api/login-pin/set`: Set a new login PIN.
  - `POST /api/login-pin/verify`: Verify the login PIN.
- **Transactions**
  - `POST /api/transactions/send`: Send money to another user.
  - `GET /api/transactions`: Get the user's transaction history.
  - `POST /api/coupons/redeem`: Redeem a coupon.
- **Beneficiaries**
  - `POST /api/add_beneficiary`: Add a new beneficiary.
  - `GET /api/beneficiaries`: Get the list of beneficiaries.
  - `GET /api/search_user`: Search for a user by phone number.
- **Cards**
  - `POST /api/has_card`: Check if the user has a virtual card.
  - `POST /api/get_card`: Create a new virtual card.
  - `POST /api/get_card_details`: Get the details of the user's virtual card.
  - `POST /api/freeze_card`: Freeze or unfreeze the virtual card.
  - `POST /api/delete_card`: Delete the virtual card.
- **QR Code**
  - `POST /api/qr-decode`: Decode a QR code.
  - `GET /api/qr-scans`: Get the user's QR scan history.
  - `GET /api/qr-scans/latest`: Get the latest QR scan.
  - `POST /api/qr/verify-user`: Verify a user from a scanned QR code.
