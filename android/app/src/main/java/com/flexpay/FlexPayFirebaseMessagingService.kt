package com.flexpay

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class FlexPayFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        android.util.Log.d("FCM", "New FCM Token: $token")

        // Store token locally
        val sharedPref = getSharedPreferences("FlexPayFCM", Context.MODE_PRIVATE)
        sharedPref.edit().putString("FCM_TOKEN", token).apply()

        // Notify JavaScript side
        sendTokenToReactNative(token)
    }

    private fun sendTokenToReactNative(token: String) {
        try {
            val reactApplication = application as? ReactApplication
            val reactContext = reactApplication?.reactNativeHost?.reactInstanceManager?.currentReactContext
            
            if (reactContext != null) {
                android.util.Log.d("FCM", "Sending token to React Native: $token")
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("FCM_TOKEN_RECEIVED", token)
            } else {
                android.util.Log.d("FCM", "React context not available, token will be sent on app start")
            }
        } catch (e: Exception) {
            android.util.Log.e("FCM", "Error sending token to React Native", e)
        }
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val title = remoteMessage.notification?.title ?: "FlexPay"
        val message = remoteMessage.notification?.body ?: "New notification"
        val data = remoteMessage.data

        android.util.Log.d("FCM", "Message received - Title: $title, Body: $message")

        // Create notification
        sendNotification(title, message, data)

        // Notify JavaScript side
        notifyReactNativeOfMessage(title, message, data)
    }

    private fun sendNotification(title: String, message: String, data: Map<String, String>) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "flexpay-transactions"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Transactions",
                NotificationManager.IMPORTANCE_HIGH
            )
            channel.description = "Notification channel for transactions"
            notificationManager.createNotificationChannel(channel)
        }

        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true)
            .setSound(soundUri)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setVibrate(longArrayOf(0, 300))

        notificationManager.notify(0, notificationBuilder.build())
    }

    private fun notifyReactNativeOfMessage(title: String, message: String, data: Map<String, String>) {
        try {
            val reactApplication = application as? ReactApplication
            val reactContext = reactApplication?.reactNativeHost?.reactInstanceManager?.currentReactContext

            if (reactContext != null) {
                val map = WritableNativeMap()
                map.putString("title", title)
                map.putString("body", message)
                map.putMap("data", WritableNativeMap().apply {
                    data.forEach { (key, value) -> putString(key, value) }
                })

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("FCM_MESSAGE_RECEIVED", map)
            }
        } catch (e: Exception) {
            android.util.Log.e("FCM", "Error notifying React Native of message", e)
        }
    }

    companion object {
        fun sendTokenToReactNative(context: Context, token: String) {
            try {
                val reactApplication = (context.applicationContext as? ReactApplication)
                val reactContext = reactApplication?.reactNativeHost?.reactInstanceManager?.currentReactContext
                
                if (reactContext != null) {
                    android.util.Log.d("FCM", "Sending token to React Native from MainActivity: $token")
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("FCM_TOKEN_RECEIVED", token)
                } else {
                    android.util.Log.d("FCM", "React context not available in static method")
                }
            } catch (e: Exception) {
                android.util.Log.e("FCM", "Error sending token to React Native from MainActivity", e)
            }
        }

        fun getStoredToken(context: Context): String? {
            val sharedPref = context.getSharedPreferences("FlexPayFCM", Context.MODE_PRIVATE)
            return sharedPref.getString("FCM_TOKEN", null)
        }
    }
}
