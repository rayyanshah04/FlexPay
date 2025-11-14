# Quick Start: Testing Push Notifications & Money Transfer

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend
```bash
cd backend
python run.py
```
Backend will run on: `http://localhost:5000`

### 3. Start React Native
```bash
# In a new terminal
npm run android
# OR
npm run ios
```

## 📱 Testing Push Notifications

### Test 1: Send Money Notification
1. Login to the app
2. Tap on **"Send Money"**
3. Select any beneficiary
4. Enter an amount (e.g., 100)
5. Tap **"Confirm Payment"**
6. ✅ **Expected**: You'll see a notification: **"💸 Money Sent"**

### Test 2: Receive Money Notification
**Option A: Use Two Devices**
1. Login to Account A on Device 1
2. Login to Account B on Device 2
3. Send money from Device 1 to Account B
4. On Device 2, pull down to refresh the HomeScreen
5. ✅ **Expected**: Notification appears: **"💰 Money Received"**

**Option B: Use Backend API**
1. Login to your account in the app
2. Note your phone number
3. Use this curl command (replace TOKEN and PHONE):
```bash
# Get another user's token by logging in as them
curl -X POST http://localhost:5000/api/transactions/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SENDER_TOKEN" \
  -d '{
    "receiver_phone": "YOUR_PHONE_NUMBER",
    "amount": 500
  }'
```
4. Pull down to refresh your app's HomeScreen
5. ✅ **Expected**: Notification shows **"💰 Money Received Rs. 500"**

## 🔍 What to Look For

### Successful Send:
- ✅ Button shows "Processing..."
- ✅ Notification pops up at top of screen
- ✅ Navigates to success screen
- ✅ Balance is updated

### Successful Receive:
- ✅ Balance increases on refresh
- ✅ Notification shows automatically
- ✅ Notification has sound and vibration

### Error Handling:
- ❌ Insufficient balance → Alert shown
- ❌ Invalid amount → Alert shown
- ❌ Network error → Alert shown

## 🐛 Troubleshooting

### No Notifications Appearing?

**Android:**
1. Check notification permissions:
   - Settings → Apps → Flexpay → Notifications → Allow
2. Make sure "Do Not Disturb" is off
3. Check if notifications are enabled in app settings

**iOS:**
1. Check Settings → Flexpay → Notifications → Allow
2. Make sure notifications are not in summary mode

### Transaction Fails?

1. **Check backend is running**: Visit http://localhost:5000
2. **Check balance**: Make sure sender has enough money
3. **Check phone number**: Format should be like "03001234567"
4. **Check logs**: Look at React Native console for errors

### Backend Not Connecting?

1. **Android Emulator**: Change `config.ts` to use `10.0.2.2` instead of `localhost`
2. **Physical Device**: 
   - Make sure phone and computer are on same WiFi
   - Update `config.ts` with your computer's IP address
   - Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

## 📊 Verification Checklist

- [ ] Backend starts without errors
- [ ] App builds and runs
- [ ] Can login successfully
- [ ] Send money works and shows notification
- [ ] Balance decreases for sender
- [ ] Refresh shows received money notification
- [ ] Balance increases for receiver
- [ ] Notifications appear as system notifications (not in-app toasts)
- [ ] Notification has sound
- [ ] Notification has vibration

## 🎯 Quick Demo Script

**For showing to someone in 2 minutes:**

1. Open app and show HomeScreen with balance
2. Tap "Send Money"
3. Select a user and enter amount: **100**
4. Tap "Confirm Payment"
5. **🎉 Point out the notification** that appears at the top
6. Show the success screen
7. **👆 Pull down on HomeScreen** to refresh
8. If someone sent you money, another notification appears!

## 📝 Backend API Reference

### Send Money
```bash
POST /api/transactions/send
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body:
{
  "receiver_phone": "03001234567",
  "amount": 100.50,
  "note": "Optional message"
}

Response (Success):
{
  "message": "Transaction successful",
  "transaction_id": 42,
  "amount": 100.50,
  "receiver_name": "John Doe",
  "sender_name": "Jane Smith",
  "new_balance": 4899.50
}
```

### Get Balance
```bash
GET /api/balance
Headers:
  Authorization: Bearer YOUR_TOKEN

Response:
{
  "balance": 5000.00
}
```

## 🎨 Notification Customization

To change notification behavior, edit `src/utils/NotificationService.ts`:

```typescript
// Change notification channel
transactionNotification('sent', amount, name) {
  this.localNotification(
    'Custom Title', 
    'Custom Message',
    'flexpay-transactions'  // Channel ID
  );
}

// Change notification importance
createChannel({
  channelId: 'flexpay-transactions',
  importance: Importance.HIGH,  // HIGH, DEFAULT, LOW, MIN
  vibrate: true,
  sound: 'custom_sound.mp3'
});
```

## ✅ Success Criteria

If you can check all these boxes, it's working perfectly:

- [ ] **Notifications show on actual phone notification bar** (not in-app)
- [ ] **Backend deducts money from sender**
- [ ] **Backend adds money to receiver**
- [ ] **Proper validation** (can't overdraw, can't send negative)
- [ ] **User-friendly error messages**
- [ ] **Transaction persists** in database

---

**Need help?** Check:
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `NOTIFICATIONS_AND_TRANSFER.md` - Detailed technical docs
- Console logs for error messages
