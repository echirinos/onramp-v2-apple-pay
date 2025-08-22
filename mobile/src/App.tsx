import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
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
      colors={["#0052FF", "#1652F0", "#0041CC"]}
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
            <View style={styles.brandContainer}>
              <View style={styles.coinbaseLogo}>
                <Image 
                  source={require("../assets/images.png")} 
                  style={styles.coinbaseLogoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandName}>Coinbase</Text>
            </View>
            <Text style={styles.title}>Buy crypto instantly</Text>
            <Text style={styles.subtitle}>Purchase ETH with Apple Pay in seconds</Text>
          </View>

          {/* Main Content Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cryptoIcon}>
                <Image 
                  source={require("../assets/kisspng-ethereum-blockchain-bitcoin-logo-see-you-there-5b2b2447696084.9131561015295539914316.jpg")} 
                  style={styles.ethLogoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.cardTitle}>Ethereum</Text>
              <Text style={styles.cardSubtitle}>
                Enter amount to purchase
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
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingTop: 40,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  coinbaseLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  coinbaseLogoImage: {
    width: 24,
    height: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0052FF",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "400",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 0,
    marginVertical: 16,
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  cryptoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  ethLogoImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  cryptoIconText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A0B0D",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#5B616E",
    textAlign: "center",
    fontWeight: "400",
  },
  conversionInfo: {
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EAEE",
  },
  conversionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0B0D",
    marginBottom: 4,
  },
  conversionSubtext: {
    fontSize: 14,
    color: "#5B616E",
    textAlign: "center",
    fontWeight: "400",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    marginTop: "auto",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontWeight: "400",
  },
});
