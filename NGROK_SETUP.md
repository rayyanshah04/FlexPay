# 🚀 ngrok Setup Guide for FlexPay APK Testing

## Quick Steps

### 1️⃣ Start Your Backend
```bash
cd d:\GitHub\FlexPay\backend
python run.py
```
Keep this terminal running.

### 2️⃣ Start ngrok (in a NEW terminal)
```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding   https://abcd-1234-xyz.ngrok-free.app -> http://localhost:5000
```

### 3️⃣ Update config.ts
Copy the ngrok HTTPS URL and update `src/config.ts`:

```typescript
ngrok: {
    API_BASE: 'https://abcd-1234-xyz.ngrok-free.app',  // ← Paste your ngrok URL here
},
```

Then change the environment to ngrok:
```typescript
const CURRENT_ENV: 'local' | 'ngrok' | 'production' = 'ngrok';  // ← Change to 'ngrok'
```

### 4️⃣ Build APK
```bash
cd d:\GitHub\FlexPay
cd android
gradlew.bat assembleRelease
```

### 5️⃣ Find Your APK
Location: `android\app\build\outputs\apk\release\app-release.apk`

Send this APK to your friend!

---

## ⚠️ Important Notes

- **Keep both terminals running** (backend + ngrok) while your friend tests
- ngrok free URLs change every restart - you'll need to rebuild the APK if you restart ngrok
- When done testing, change `CURRENT_ENV` back to `'local'` in config.ts

## 🔄 Switching Back to Local Development

After testing, update `src/config.ts`:
```typescript
const CURRENT_ENV: 'local' | 'ngrok' | 'production' = 'local';  // ← Change back to 'local'
```
