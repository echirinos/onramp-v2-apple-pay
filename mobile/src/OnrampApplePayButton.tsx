import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { apiClient } from "./utils/apiClient";

type PaymentStatus =
  | "idle"
  | "creating-order"
  | "loading-payment"
  | "ready"
  | "processing"
  | "success"
  | "error";

export default function OnrampApplePayButton({
  fiatAmount,
}: {
  fiatAmount: number;
}) {
  const webViewRef = useRef<WebView>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (fiatAmount > 0) {
      // Small delay to avoid excessive API calls while user is typing
      const timer = setTimeout(() => {
        createOrder();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setStatus("idle");
      setPaymentLink(null);
      setErrorMessage(null);
    }
  }, [fiatAmount]);

  const createOrder = async () => {
    setStatus("creating-order");
    setErrorMessage(null);

    try {
      const response = await apiClient.post<any>("/api/create-order", {
        paymentAmount: fiatAmount.toString(),
        purchaseAmount: fiatAmount.toString(),
        paymentCurrency: "USD",
        purchaseCurrency: "ETH",
        paymentMethod: "GUEST_CHECKOUT_APPLE_PAY",
        destinationAddress: "0x0000000000000000000000000000000000000000",
        destinationNetwork: "base",
        email: "test@test.com",
        phoneNumber: "+12055555555", // Added + prefix for proper formatting
        phoneNumberVerifiedAt: "2025-08-07T00:00:00Z",
        partnerUserRef: "sandbox-123", // This enables sandbox mode
        agreementAcceptedAt: "2025-08-07T00:00:00Z",
      });

      if (response.paymentLink) {
        setPaymentLink(response.paymentLink.url);
        setStatus("loading-payment");

        // Fallback: if WebView doesn't emit ready event within 5 seconds, assume it's ready
        setTimeout(() => {
          if (status === "loading-payment") {
            console.log("Fallback: Setting status to ready after timeout");
            setStatus("ready");
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setStatus("error");
      setErrorMessage("Failed to create payment order. Please try again.");
    }
  };

  // Render loading state while creating order
  if (status === "creating-order") {
    return (
      <View style={styles.compactLoadingContainer}>
        <ActivityIndicator size="small" color="#667eea" />
        <Text style={styles.compactLoadingText}>Creating payment order...</Text>
      </View>
    );
  }

  // Render error state
  if (status === "error" && errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    );
  }

  // Render success state
  if (status === "success") {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successMessage}>
          Your crypto has been sent to your wallet
        </Text>
        <View style={styles.successBadge}>
          <Text style={styles.successBadgeText}>✓ Transaction Complete</Text>
        </View>
      </View>
    );
  }

  // Don't render anything if no payment link or amount is 0
  if (!paymentLink || fiatAmount === 0) {
    return null;
  }

  const finalUrl = `${paymentLink}&forceFeature=true`;

  return (
    <>
      {/* Loading overlay for payment processing */}
      {status === "processing" && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.processingTitle}>Processing Payment</Text>
            <Text style={styles.processingSubtext}>
              Please wait while we complete your transaction...
            </Text>
          </View>
        </View>
      )}

      {/* Status indicator - overlay on top of WebView */}
      {paymentLink && status === "loading-payment" && (
        <View style={styles.loadingOverlayContainer}>
          <View style={styles.compactLoadingContainer}>
            <ActivityIndicator size="small" color="#667eea" />
            <Text style={styles.compactLoadingText}>Loading Apple Pay...</Text>
          </View>
        </View>
      )}

      {/* WebView - always show when paymentLink exists */}
      {paymentLink && (
        <WebView
          ref={webViewRef}
          style={styles.webView}
          onMessage={({ nativeEvent }) => {
            try {
              const { eventName, data } = JSON.parse(nativeEvent.data) as any;
              console.log("Received event:", eventName, data);

              switch (eventName) {
                case "onramp_api.load_pending":
                  setStatus("loading-payment");
                  break;

                case "onramp_api.load_success":
                  setStatus("ready");
                  break;

                case "onramp_api.load_error":
                  setStatus("error");
                  const loadErrorMessage =
                    data?.errorMessage || "Failed to load Apple Pay button";
                  setErrorMessage(loadErrorMessage);
                  console.error(
                    "Load error:",
                    data?.errorCode,
                    loadErrorMessage
                  );
                  break;

                case "onramp_api.commit_success":
                  setStatus("processing");
                  Alert.alert(
                    "Payment Started",
                    "Your Apple Pay transaction has been initiated. We're processing your payment...",
                    [{ text: "OK" }]
                  );
                  break;

                case "onramp_api.commit_error":
                  setStatus("error");
                  const commitErrorMessage =
                    data?.errorMessage || "Payment failed. Please try again.";
                  setErrorMessage(commitErrorMessage);
                  Alert.alert("Payment Failed", commitErrorMessage, [
                    { text: "OK" },
                  ]);
                  console.error(
                    "Commit error:",
                    data?.errorCode,
                    commitErrorMessage
                  );
                  break;

                case "onramp_api.cancel":
                  setStatus("ready"); // Back to ready state
                  Alert.alert(
                    "Payment Cancelled",
                    "You cancelled the Apple Pay payment.",
                    [{ text: "OK" }]
                  );
                  break;

                case "onramp_api.polling_start":
                  setStatus("processing");
                  break;

                case "onramp_api.polling_success":
                  setStatus("success");
                  Alert.alert(
                    "Payment Successful! 🎉",
                    "Your crypto purchase was completed successfully and funds have been sent to your wallet.",
                    [{ text: "Awesome!" }]
                  );
                  break;

                case "onramp_api.polling_error":
                  setStatus("error");
                  const pollingErrorMessage =
                    data?.errorMessage ||
                    "Transaction failed during processing.";
                  setErrorMessage(pollingErrorMessage);
                  Alert.alert("Transaction Failed", pollingErrorMessage, [
                    { text: "OK" },
                  ]);
                  console.error(
                    "Polling error:",
                    data?.errorCode,
                    pollingErrorMessage
                  );
                  break;

                default:
                  console.log("Unknown event:", eventName, data);
                  break;
              }
            } catch (error) {
              console.error("Error parsing message:", error, nativeEvent.data);
            }
          }}
          source={{ uri: finalUrl }}
          startInLoadingState={true}
          style={styles.webView}
          injectedJavaScript={`
            document.body.style.backgroundColor = 'transparent';
            document.documentElement.style.backgroundColor = 'transparent';
            true;
          `}
          onLoadEnd={() => {
            // Ensure transparency after load
            webViewRef.current?.injectJavaScript(`
              document.body.style.backgroundColor = 'transparent';
              document.documentElement.style.backgroundColor = 'transparent';
              true;
            `);

            // Set to ready if still loading after WebView loads
            if (status === "loading-payment") {
              console.log("WebView loaded, setting status to ready");
              setTimeout(() => setStatus("ready"), 500);
            }
          }}
        />
      )}
    </>
  );
}

const styles = {
  loadingOverlayContainer: {
    position: "absolute" as const,
    top: 16,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  compactLoadingContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 16,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6EAEE",
  },
  compactLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#0052FF",
  },
  errorContainer: {
    alignItems: "center" as const,
    padding: 24,
    backgroundColor: "#FDF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F5C6CB",
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#D73A49",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#721C24",
    textAlign: "center" as const,
    lineHeight: 20,
  },
  successContainer: {
    alignItems: "center" as const,
    padding: 24,
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B3E5FC",
  },
  successIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#0052FF",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: "#1565C0",
    textAlign: "center" as const,
    marginBottom: 16,
    lineHeight: 20,
  },
  successBadge: {
    backgroundColor: "#0052FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  successBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  processingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    zIndex: 1000,
    borderRadius: 16,
  },
  processingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center" as const,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  processingTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#333",
  },
  processingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center" as const,
  },

  webView: {
    height: 60,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden" as const,
    backgroundColor: "transparent",
    marginTop: 16,
  },
};
