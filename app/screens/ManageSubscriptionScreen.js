import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

function ManageSubscriptionScreen({ navigation }) {
  const { user, setUser } = useAuth();

  const handleBack = useCallback(() => navigation.goBack(), []);

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        title="Manage Subscription"
        onPressLeft={handleBack}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default ManageSubscriptionScreen;
