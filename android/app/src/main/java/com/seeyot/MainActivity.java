package com.seeyot;

import android.os.Bundle;

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


