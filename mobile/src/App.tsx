import { StyleSheet, View } from 'react-native';
import OnrampApplePayButton from './OnrampApplePayButton';
import { CustomInput } from './components/CustomInput';
import { useState } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const AppContent = () => {
  const [fiatAmount, setFiatAmount] = useState(0);
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]} >
      <CustomInput 
        label="Amount ETH"
        placeholder='Enter amount' 
        keyboardType='numeric' 
        onChangeText={(text: string) => setFiatAmount(Number(text))} 
        value={fiatAmount.toString()}
      />
      <OnrampApplePayButton fiatAmount={fiatAmount} />
    </View>
  )
}

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
    height: '100%',
    width: '100%',
    display: 'flex',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});
