<p align="center">
  <img src="src/assets/logo.png" alt="FlexPay Logo" width="120"/>
</p>

<h1 align="center">FlexPay</h1>

<p align="center">
  A mobile payment app with virtual cards, QR payments, and real-time notifications.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"/>
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/React_Native-0.82.0-61DAFB?logo=react&logoColor=white" alt="React Native"/>
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Flask-API-000000?logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/TypeScript-strict-007ACC?logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

---

## Overview

FlexPay is a full-stack mobile payment application. Users can send and receive money, manage virtual debit/credit cards, pay via QR code, and receive real-time push notifications for every transaction. The frontend is built in React Native (TypeScript) and the backend is a Python Flask REST API with JWT authentication.

---

## Features

| Feature | Description |
|---|---|
| Secure Auth | JWT-based signup/login + 4-digit PIN lock |
| Send & Receive | Instant transfers to other FlexPay users |
| Virtual Cards | Mastercard / Visa / Amex virtual cards |
| Card Management | Freeze, unfreeze, or delete your card |
| QR Payments | Generate your QR code or scan others to pay |
| Transaction History | Full log of all incoming and outgoing transfers |
| Beneficiaries | Save frequent payees for quick access |
| Push Notifications | Real-time alerts via Firebase Cloud Messaging |
| Profile Management | Update info, change password, delete account |

---

## Tech Stack

### Frontend

| | Technology |
|---|---|
| Framework | React Native 0.82 |
| Language | TypeScript |
| Navigation | React Navigation |
| State | Redux Toolkit |
| UI | React Native Paper (Material Design) |
| Testing | Jest |
| Linting | ESLint |

### Backend

| | Technology |
|---|---|
| Language | Python 3 |
| Framework | Flask |
| Database | SQLite |
| Auth | PyJWT |
| Push Notifications | pyfcm (Firebase) |
| Test Data | Faker |

---

## Screenshots

> Screenshots coming soon.

---

## Project Structure

```
FlexPay/
├── backend/
│   ├── app/
│   │   ├── api/          # Blueprints: auth, transactions, cards, etc.
│   │   └── __init__.py   # Flask app factory
│   ├── requirements.txt
│   └── run.py
├── src/
│   ├── assets/           # Images, fonts, icons
│   ├── components/       # Reusable UI components
│   ├── navigations/      # React Navigation setup
│   ├── screens/          # All app screens
│   ├── slices/           # Redux slices
│   ├── store/            # Redux store
│   ├── theme/            # Colors, typography, styles
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions
├── App.tsx
└── package.json
```

---

## Prerequisites

- Node.js >= 20
- Python 3.x
- React Native development environment set up ([guide](https://reactnative.dev/docs/environment-setup))
- Android Studio or Xcode (for emulator/simulator)

---

## Setup

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

The API will be available at `http://127.0.0.1:5000`.

### 2. Frontend

```bash
# From project root
npm install
```

### 3. Run

**Android:**
```bash
npm run android
```

**iOS:**
```bash
cd ios && pod install && cd ..
npm run ios
```

---

## API Reference

<details>
<summary>Auth</summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/signup` | Create account |
| POST | `/api/login` | Login |
| POST | `/api/session/refresh` | Refresh token |

</details>

<details>
<summary>User</summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/balance` | Account balance |
| GET | `/api/profile` | Profile info |
| PUT | `/api/profile/update` | Update profile |
| PUT | `/api/password/change` | Change password |
| DELETE | `/api/account/delete` | Delete account |
| GET | `/api/qr-data` | QR code data |
| POST | `/api/user/device-token` | Register push token |
| GET | `/api/login-pin/check` | Check PIN status |
| POST | `/api/login-pin/set` | Set PIN |
| POST | `/api/login-pin/verify` | Verify PIN |

</details>

<details>
<summary>Transactions</summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transactions/send` | Send money |
| GET | `/api/transactions` | Transaction history |
| POST | `/api/coupons/redeem` | Redeem coupon |

</details>

<details>
<summary>Cards</summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/has_card` | Check card status |
| POST | `/api/get_card` | Create virtual card |
| POST | `/api/get_card_details` | Card details |
| POST | `/api/freeze_card` | Freeze / unfreeze |
| POST | `/api/delete_card` | Delete card |

</details>

<details>
<summary>Beneficiaries & QR</summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/add_beneficiary` | Add beneficiary |
| GET | `/api/beneficiaries` | List beneficiaries |
| GET | `/api/search_user` | Search by phone |
| POST | `/api/qr-decode` | Decode QR |
| GET | `/api/qr-scans` | QR scan history |
| GET | `/api/qr-scans/latest` | Latest QR scan |
| POST | `/api/qr/verify-user` | Verify from QR |

</details>

---

## Linting & Tests

```bash
npm run lint    # ESLint
npm run test    # Jest
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---

## License

[MIT](LICENSE)
