# How to View Logs - 3 Methods

Since React Native Debugger isn't available in this environment, use one of these methods:

---

## Method 1: **ADB Logcat** (EASIEST - Works with Physical Device/Emulator)

Your device/emulator must be running and connected.

```bash
# View all logs (will be noisy)
adb logcat | grep FLEXPAY_FCM_DEBUG

# OR in your project directory:
cd /mnt/d/GitHub/FlexPay
adb logcat | grep FLEXPAY_FCM_DEBUG
```

**What you'll see:**
```
12-05 18:14:32.123  1234  5678 I ReactNativeJS: 🔥 FLEXPAY_FCM_DEBUG 🔥 [INIT] NotificationService constructor called
12-05 18:14:33.456  1234  5678 I ReactNativeJS: 🔥 FLEXPAY_FCM_DEBUG 🔥 [SETUP] setupFCMTokenListener called, Platform: android
```

---

## Method 2: **Metro Console** (Works without Debugger)

The metro bundler has a built-in console. When you run `npm run android`, the metro bundler is running and shows logs:

```bash
cd /mnt/d/GitHub/FlexPay
npm run android
```

**Look in the terminal output** for the 🔥 FLEXPAY_FCM_DEBUG logs. They'll appear mixed with other output.

---

## Method 3: **React Native Debugger (Desktop App)**

If you're on your local machine (Windows/Mac/Linux desktop):

1. **Download & Install:**
   - Go to: https://github.com/jhen0409/react-native-debugger/releases
   - Download the latest release for your OS

2. **Open it (will start on localhost:8081)**

3. **Enable debugging in your app:**
   - Shake your device or press `Ctrl+M` (Android emulator)
   - Select "Debug"
   - Debugger will auto-connect

4. **View logs in Console tab**

---

## RECOMMENDED FOR YOU:

### **Use Method 1 (ADB Logcat)** - Simplest Right Now

Run this in a terminal:
```bash
adb logcat | grep "FLEXPAY_FCM_DEBUG"
```

Then:
1. Login to your app on the device
2. Watch the terminal for all 5 checkpoint logs
3. Tell me which checkpoint fails

---

## Quick Test

To verify your setup is working, run this command to see ANY Android logs:

```bash
adb logcat | head -20
```

If you see output, your device/emulator is connected and ready.
If you see "adb: not found" or "error", your Android SDK isn't set up yet.
