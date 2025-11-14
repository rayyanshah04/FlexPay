# 🔔 How to Test Push Notifications (Single Phone)

## Super Quick Way

### Step 1: Run the App
```bash
npm run android
# or
npm run ios
```

### Step 2: Navigate to Test Screen
1. Open the app
2. Tap the **"More"** tab (bottom right) 👤
3. Scroll down to **"🔧 Developer Tools"**
4. Tap **"🔔 Test Notifications"**

### Step 3: Test!
You'll see a screen with 3 buttons:

#### 💸 Test "Money Sent"
- Tap this button
- Look at the top of your phone screen
- You should see: **"💸 Money Sent - You sent Rs. 100 to John Doe"**
- Notification has sound + vibration

#### 💰 Test "Money Received"  
- Tap this button
- Look at the top of your phone screen
- You should see: **"💰 Money Received - You received Rs. 100 from John Doe"**
- Notification has sound + vibration

#### 🔔 Test Custom
- Tap this button
- You'll see a generic test notification
- Proves notifications are working

### Step 4: Customize
- Change the **Amount** field (e.g., 500)
- Change the **Name** field (e.g., Alice)
- Tap any button again to see customized notification

## ✅ What to Check

Pull down your notification shade and verify:
- [ ] Notification appears in system tray
- [ ] Has sound
- [ ] Has vibration
- [ ] Shows proper icon
- [ ] Shows correct message
- [ ] Stays in notification history

## 🎯 Quick Demo (30 seconds)

1. Open app → More tab
2. Tap "Test Notifications"
3. Tap "💸 Money Sent"
4. **Show the notification that appears!** 🎉
5. Pull down notification shade to see it persists

## 🐛 Not Seeing Notifications?

### Check Permissions
1. Go to **Settings** → **Apps** → **Flexpay**
2. Tap **Notifications**
3. Make sure **"Allow notifications"** is ON
4. Check all channels are enabled

### Other Issues
- Turn off **"Do Not Disturb"** mode
- Make sure volume is up
- Try closing and reopening the app
- Check if notifications work for other apps (to rule out system issue)

## 📱 What Happens Behind the Scenes

When you tap a test button:
```javascript
// This code runs
NotificationService.transactionNotification('sent', '100', 'John Doe');

// Which creates a system notification with:
- Title: "💸 Money Sent"
- Message: "You sent Rs. 100 to John Doe"
- Channel: "flexpay-transactions"
- Sound: default
- Vibration: 300ms
- Priority: HIGH
```

## 🎨 The Test Screen Features

- **Live preview** of notification text
- **Editable fields** for amount and name
- **3 test types** for different scenarios
- **Help sections** right in the UI
- **No backend required** - all local!

## 🚀 Next: Test Real Transactions

Once you've verified notifications work:

1. Go back to Home screen
2. Send money to someone (actual transaction)
3. You'll see the same notification appear after confirming!

## 💡 Pro Tips

1. **Test all 3 types** to make sure everything works
2. **Check notification history** by pulling down notification shade
3. **Try different amounts** like 1000, 50, 999999
4. **Try different names** with emojis or special characters
5. **Test with app in background** - notifications should still work!

---

**That's it!** You now have a built-in test screen to verify push notifications without needing a second phone. 🎉
