import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {PhoneNumberInputScreenProps} from '../utils/types';
import {showToast} from '../utils/toast';

const PhoneNumberInputScreen: React.FC<PhoneNumberInputScreenProps> = ({
  navigation,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleNext = () => {
    if (phoneNumber.length === 10) {
      navigation.navigate('OTPVerification', {phoneNumber});
    } else {
      showToast('error', 'Please enter a valid 10-digit phone number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your phone number:</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={10}
      />
      <Button title="Next" onPress={handleNext} />
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

export default PhoneNumberInputScreen;
