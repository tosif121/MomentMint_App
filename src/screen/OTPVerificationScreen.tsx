// OTPVerificationScreen.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {OTPVerificationScreenProps} from '../utils/types';
import {showToast} from '../utils/toast';

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const {phoneNumber} = route.params;
  const [otp, setOtp] = useState<string>('');

  const handleVerify = () => {
    if (otp.length === 6) {
      // Call your OTP verification API here and navigate based on success
      console.log('Verifying OTP:', otp);
      // Navigate to the next screen on successful verification
    } else {
      showToast('error', 'Please enter a valid 6-digit OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter the OTP sent to {phoneNumber}:</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default OTPVerificationScreen;
