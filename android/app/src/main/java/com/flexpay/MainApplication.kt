package com.flexpay

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.google.firebase.Firebase
import com.google.firebase.initialize

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    
    // Initialize Firebase
    try {
      Firebase.initialize(this)
      android.util.Log.d("Firebase", "Firebase initialized successfully")
    } catch (e: Exception) {
      android.util.Log.e("Firebase", "Error initializing Firebase", e)
    }
    
    loadReactNative(this)
  }
}
