# Push Notifications & Money Transfer Implementation

## Overview
This implementation adds:
1. **Local Push Notifications** - Shows native notifications when money is sent or received
2. **Complete Money Transfer Backend** - Full backend implementation for sending money with proper balance validation

## Features Implemented

### 1. Push Notifications

#### React Native Side (`src/utils/NotificationService.ts`)
- Uses `react-native-push-notification` for local notifications
- Two notification channels:
  - `flexpay-transactions`: High priority for transaction notifications
  - `flexpay-general`: Default priority for general notifications
- Transaction-specific notifications with custom messages:
  - 💸 **Money Sent**: "You sent Rs. X to [Name]"
  - 💰 **Money Received**: "You received Rs. X from [Name]"

#### Android Configuration
- Added permissions in `AndroidManifest.xml`:
  - `VIBRATE`: Vibration on notification
  - `RECEIVE_BOOT_COMPLETED`: Notifications after device reboot
  - `POST_NOTIFICATIONS`: Android 13+ notification permission

### 2. Money Transfer Backend

#### Endpoint: `POST /api/transactions/send`

**Request Body:**
```json
{
  "receiver_phone": "03001234567",
  "amount": 1000.50,
  "note": "Optional note"
}
```

**Success Response (200):**
```json
{
  "message": "Transaction successful",
  "transaction_id": 123,
  "amount": 1000.50,
  "receiver_name": "John Doe",
  "sender_name": "Jane Doe",
  "new_balance": 8999.50
}
```

**Error Responses:**
- `400`: Invalid amount, missing fields, sending to self
- `404`: Receiver not found
- `500`: Transaction failed

#### Backend Features:
1. **Atomic Transactions**: 
   - Deducts from sender's balance
   - Adds to receiver's balance
   - Records transaction in database
   - All in a single transaction

2. **Balance Validation**:
   - Checks sender has sufficient funds
   - Validates amount is positive
   - Prevents sending to self

3. **Transaction Logging**:
   - Logs all transaction attempts
   - Records success and failures
   - Includes transaction IDs for tracking

### 3. Frontend Integration

#### ConfirmPayment Screen (`src/screens/Payments/ConfirmPayment.tsx`)
- Calls the real backend API instead of mock timeout
- Shows loading state during transaction
- Displays error alerts if transaction fails
- Triggers notification on successful send
- Passes transaction ID to success screen

#### HomeScreen (`src/screens/Home/HomeScreen.tsx`)
- Monitors balance changes
- Automatically shows notification when balance increases (money received)
- Uses `useRef` to track previous balance
- Triggers notification with amount difference

## How to Test

### 1. Setup
```bash
# Install dependencies
npm install

# Start backend (in backend directory)
python run.py

# Start React Native
npm run android
# or
npm run ios
```

### 2. Test Sending Money
1. Login to the app
2. Navigate to "Send Money"
3. Select a beneficiary or search for a user
4. Enter amount
5. Click "Confirm Payment"
6. **Expected**: 
   - Transaction completes
   - Notification appears: "💸 Money Sent"
   - Balance updates
   - Navigate to success screen

### 3. Test Receiving Money
1. Have another user send you money (or use backend API directly)
2. Pull to refresh on HomeScreen
3. **Expected**:
   - Balance increases
   - Notification appears: "💰 Money Received"

### 4. Test Backend Directly
```bash
# Using curl (replace TOKEN with actual JWT)
curl -X POST http://localhost:5000/api/transactions/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "receiver_phone": "03001234567",
    "amount": 100,
    "note": "Test payment"
  }'
```

## Notification Channels

### Transaction Channel
- **ID**: `flexpay-transactions`
- **Name**: Transactions
- **Importance**: HIGH
- **Features**: Sound, Vibration, Heads-up display

### General Channel
- **ID**: `flexpay-general`
- **Name**: General
- **Importance**: DEFAULT
- **Features**: Sound, Vibration

## Files Modified/Created

### Created:
- `src/utils/NotificationService.ts` - Notification service singleton

### Modified:
- `App.tsx` - Initialize notification service
- `src/screens/Payments/ConfirmPayment.tsx` - Real API integration
- `src/screens/Home/HomeScreen.tsx` - Balance change detection
- `backend/app/api/transactions.py` - Improved send_money endpoint
- `android/app/src/main/AndroidManifest.xml` - Notification permissions
- `package.json` - Added notification dependencies

## Dependencies Added
- `react-native-push-notification`: ^8.1.1
- `@react-native-community/push-notification-ios`: ^1.11.0

## Notes

1. **iOS Setup**: For iOS, additional setup is required:
   - Configure push notification capabilities in Xcode
   - Add notification service extension for remote notifications
   - Request user permission explicitly

2. **Production Considerations**:
   - For production, use Firebase Cloud Messaging (FCM) for remote notifications
   - Store FCM tokens in backend database
   - Send notifications from backend when transactions occur
   - Implement notification history/inbox feature

3. **Security**:
   - All endpoints require JWT authentication
   - Transaction amounts are validated server-side
   - Balance checks prevent overdrafts
   - Logging tracks all transaction attempts

4. **Testing**:
   - Use Android emulator or physical device
   - Notifications work best on physical devices
   - Check Android notification settings if notifications don't appear

## Future Enhancements

1. **Remote Notifications**:
   - Implement FCM for push notifications
   - Send notifications even when app is closed
   - Add notification actions (view transaction, reply)

2. **Transaction Details**:
   - Show sender name in received notifications
   - Include transaction ID in notification
   - Deep link to transaction details

3. **Notification Settings**:
   - Allow users to customize notification preferences
   - Enable/disable transaction notifications
   - Choose notification sound

4. **Real-time Updates**:
   - Use WebSockets for instant balance updates
   - Push notifications from server on transaction completion
   - Live transaction status tracking
