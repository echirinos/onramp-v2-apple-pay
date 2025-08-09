import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { apiClient } from "./utils/apiClient";

export default function OnrampApplePayButton({ fiatAmount }: { fiatAmount: number }) {

  const webViewRef = useRef<WebView>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  useEffect(() => {
    if(fiatAmount > 0) {  
      createOrder();
    }
  }, [fiatAmount]);

  const createOrder = async () => {

    try {
      const response = await apiClient.post<any>(
        "/api/create-order",
        {
          paymentAmount: fiatAmount.toString(),
          purchaseAmount: fiatAmount.toString(),
          paymentCurrency: 'USD',
          purchaseCurrency: 'ETH',
          paymentMethod: "GUEST_CHECKOUT_APPLE_PAY",
          destinationAddress: '0x0000000000000000000000000000000000000000',
          destinationNetwork: 'base',
          email: 'test@test.com',
          phoneNumber: '12055555555',
          phoneNumberVerifiedAt: "2025-08-07T00:00:00Z",
          partnerUserRef: 'sandbox-123',
          agreementAcceptedAt: "2025-08-07T00:00:00Z",
        }
      );

      if (response.paymentLink) {
        setPaymentLink(response.paymentLink.url);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  if(!paymentLink || fiatAmount === 0) {
   return null;
  }

  const finalUrl = `${paymentLink}&forceFeature=true`;

  return (
    <>
      {paymentLink && <WebView
        ref={webViewRef}
        style={{
          height: 400,
          flex: 1,
          width: Dimensions.get('window').width - 35,
          display: 'flex', 
        }}

        onMessage={({ nativeEvent }) => {
          const { eventName } = JSON.parse(
            nativeEvent.data
          ) as any;

          switch (eventName) {
            case "onramp_api.load_pending":
              break;
            case "onramp_api.load_success":
              break;
            case "onramp_api.commit_error":
            case "onramp_api.cancel":
              Alert.alert("Imagine apple pay tray opening :-)");
              break;
            case "onramp_api.commit_success":
              break;
            default:
              break;
          }
        }}

        source={{ uri: finalUrl }}
        startInLoadingState={true}
      />
      }
    </>
  );
}
