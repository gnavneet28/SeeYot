package com.seeyot;

import android.os.Bundle;

// notification channe
import android.os.Build;
import android.app.NotificationChannel;
import android.media.AudioAttributes;
import android.net.Uri;
import android.content.ContentResolver;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;


import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.ReactActivityDelegateWrapper;
import android.view.View;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support 
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.


    setTheme(R.style.AppTheme);
    super.onCreate(null);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel = new NotificationChannel("default_channel", "SeeYot", NotificationManager.IMPORTANCE_HIGH);
      notificationChannel.setShowBadge(true);
      notificationChannel.setDescription("");
      AudioAttributes att = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build();
      notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/notification_bell"), att);
      notificationChannel.enableVibration(true);
      notificationChannel.setVibrationPattern(new long[]{400, 400});
      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      NotificationManager manager = getSystemService(NotificationManager.class);
      manager.createNotificationChannel(notificationChannel);
  }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel = new NotificationChannel("thought", "SeeYot", NotificationManager.IMPORTANCE_HIGH);
      notificationChannel.setShowBadge(true);
      notificationChannel.setDescription("");
      AudioAttributes att = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build();
      notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/thought"), att);
      notificationChannel.enableVibration(true);
      notificationChannel.setVibrationPattern(new long[]{400, 400});
      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      NotificationManager manager = getSystemService(NotificationManager.class);
      manager.createNotificationChannel(notificationChannel);
  }
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //     NotificationChannel notificationChannel = new NotificationChannel("favorite", "SeeYot", NotificationManager.IMPORTANCE_HIGH);
  //     notificationChannel.setShowBadge(true);
  //     notificationChannel.setDescription("");
  //     AudioAttributes att = new AudioAttributes.Builder()
  //             .setUsage(AudioAttributes.USAGE_NOTIFICATION)
  //             .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
  //             .build();
  //     notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/active_chat"), att);
  //     notificationChannel.enableVibration(true);
  //     notificationChannel.setVibrationPattern(new long[]{400, 400});
  //     notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
  //     NotificationManager manager = getSystemService(NotificationManager.class);
  //     manager.createNotificationChannel(notificationChannel);
  // }
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //     NotificationChannel notificationChannel = new NotificationChannel("thought", "SeeYot", NotificationManager.IMPORTANCE_HIGH);
  //     notificationChannel.setShowBadge(true);
  //     notificationChannel.setDescription("");
  //     AudioAttributes att = new AudioAttributes.Builder()
  //             .setUsage(AudioAttributes.USAGE_NOTIFICATION)
  //             .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
  //             .build();
  //     notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/active_chat"), att);
  //     notificationChannel.enableVibration(true);
  //     notificationChannel.setVibrationPattern(new long[]{400, 400});
  //     notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
  //     NotificationManager manager = getSystemService(NotificationManager.class);
  //     manager.createNotificationChannel(notificationChannel);
  // }


    // navigation bar edit
   // hideNavigationBar();
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually

  }
   
 // navigation bar edit
  // @Override
  // public void onWindowFocusChanged(boolean hasFocus) {
  //     super.onWindowFocusChanged(hasFocus);
  //     if (hasFocus) {
  //         hideNavigationBar();
  //     }
  // }

  // private void hideNavigationBar() {
  //     getWindow().getDecorView().setSystemUiVisibility(
  //         View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
  //         | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);

  // }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
            return new ReactActivityDelegateWrapper(
                  this,
                  new ReactActivityDelegate(this, getMainComponentName()) {
                    @Override
                    protected ReactRootView createRootView() {
                      return new RNGestureHandlerEnabledRootView(MainActivity.this);
                    }
                  }
                );
    }
}


