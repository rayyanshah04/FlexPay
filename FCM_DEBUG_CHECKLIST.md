# FCM Token Storage Debug Checklist

When you run the app and login, look for these logs in React Native debugger. Search for **"🔥 FLEXPAY_FCM_DEBUG 🔥"**

## Step-by-Step Checkpoints

### ✅ STEP 1: App Initialization
**Log to see:**
```
🔥 FLEXPAY_FCM_DEBUG 🔥 [INIT] NotificationService constructor called
🔥 FLEXPAY_FCM_DEBUG 🔥 [SETUP] setupFCMTokenListener called, Platform: android
🔥 FLEXPAY_FCM_DEBUG 🔥 [SETUP] Setting up Android FCM token listener
🔥 FLEXPAY_FCM_DEBUG 🔥 [SETUP] ✅ Event listeners registered successfully
```
**If you don't see these:** The NotificationService isn't initializing

---

### ✅ STEP 2: Native FCM Token Emission from Android
**Log to see:**
```
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 1/4] ✅ FCM Token Received from Native Module
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 1/4] Token value: <long_token_string>
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 1/4] Token length: 152
```
**If you don't see this:** 
- The Android native module isn't emitting the token
- Check if FCMTokenService is running in Android

---

### ✅ STEP 3: Sending Token to Backend
**Log to see:**
```
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 2/4] sendTokenToBackend called
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 2/4] Device token: <token>
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 2/4] Current auth state:
  - hasUserToken: true
  - userId: <number>
  - userName: <name>
  - userTokenLength: <number>
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 2/4] ✅ User is authenticated, proceeding with token send
```
**If you see "❌ User not authenticated":** 
- You're not logged in yet
- Or the Redux auth state isn't set up correctly

---

### ✅ STEP 4: HTTP Request to Backend
**Log to see:**
```
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 3/4] 📡 Sending token to backend
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 3/4] URL: http://<your_api>/api/user/device-token
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 3/4] Payload: { device_token: "<token>" }
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 3/4] Response status: 200
```
**If you see "❌ Failed to send device token":**
- Check the backend endpoint status
- Verify the Authorization token is valid

---

### ✅ STEP 5: Successful Storage
**Log to see:**
```
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 4/4] ✅ Device token sent to backend successfully!
🔥 FLEXPAY_FCM_DEBUG 🔥 [STEP 4/4] Response: { success: true, ... }
```
**Then verify in database:**
```sql
SELECT id, name, device_token FROM users;
```
The `device_token` column should NOT be empty

---

## How to Debug

### 1. Open React Native Debugger
```bash
# In another terminal
npx react-native-debugger-cli --open
```

### 2. Login to the app and watch logs
3. Search for "🔥 FLEXPAY_FCM_DEBUG" in the console
4. Identify which checkpoint is missing or failing
5. Report the missing checkpoint

---

## What Each Missing Checkpoint Means

| Missing Checkpoint | Problem Area |
|---|---|
| Step 1 | NotificationService not initialized |
| Step 2 | Android native FCM module not emitting token |
| Step 3 | Redux auth state not set / User not logged in |
| Step 4 | Backend API call failed (network, auth, or endpoint issue) |
| Step 5 | Backend successfully saved token |

---

## Example: All 5 Steps Successful
```
[INIT] NotificationService constructor called
[SETUP] setupFCMTokenListener called, Platform: android
[SETUP] ✅ Event listeners registered successfully
[STEP 1/4] ✅ FCM Token Received from Native Module
[STEP 1/4] Token value: eWZ...truncated
[STEP 2/4] sendTokenToBackend called
[STEP 2/4] ✅ User is authenticated
[STEP 3/4] 📡 Sending token to backend
[STEP 3/4] Response status: 200
[STEP 4/4] ✅ Device token sent to backend successfully!
```
