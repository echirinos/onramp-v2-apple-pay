import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OnrampApplePayButton from "./OnrampApplePayButton";
import { CustomInput } from "./components/CustomInput";
import { useState, useMemo } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const AppContent = () => {
  const [fiatAmount, setFiatAmount] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        style={[styles.container, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle="light-content" />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Crypto Onramp</Text>
            <Text style={styles.subtitle}>Buy crypto with Apple Pay</Text>
          </View>

          {/* Main Content Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>💰 Purchase ETH</Text>
              <Text style={styles.cardSubtitle}>
                Enter the amount you'd like to buy
              </Text>
            </View>

            <CustomInput
              label="Amount (USD)"
              placeholder="0.00"
              keyboardType="numeric"
              onChangeText={(text: string) => setFiatAmount(Number(text))}
              value={fiatAmount === 0 ? "" : fiatAmount.toString()}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            {fiatAmount > 0 && (
              <View style={styles.conversionInfo}>
                <Text style={styles.conversionText}>
                  ≈ {(fiatAmount / 3000).toFixed(6)} ETH
                </Text>
                <Text style={styles.conversionSubtext}>
                  Estimated amount (rates may vary)
                </Text>
              </View>
            )}

            {useMemo(
              () => (
                <OnrampApplePayButton fiatAmount={fiatAmount} />
              ),
              [fiatAmount]
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🔒 Secured by Coinbase • Sandbox Mode
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    backdropFilter: "blur(20px)",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  conversionInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  conversionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 4,
  },
  conversionSubtext: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: "auto",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "500",
  },
});
