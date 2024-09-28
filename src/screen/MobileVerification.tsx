import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import {showToast} from '../utils/toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import apiClient from '../utils/api';
import {ApiResponse} from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Country {
  name: string;
  dialCode: string;
  code: string;
}

const MobileVerification: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isCountryModalVisible, setIsCountryModalVisible] =
    useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditingNumber, setIsEditingNumber] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const otpInputsRef = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, remainingTime]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const formattedCountries = data.map((country: any) => ({
        name: country.name.common,
        dialCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
        code: country.cca2,
      }));
      setCountries(formattedCountries);
      setFilteredCountries(formattedCountries);

      const india = formattedCountries.find(country => country.code === 'IN');
      setSelectedCountry(india || formattedCountries[0]);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleGetOtp = async () => {
    try {
      const response = await axios.post(
        'http://localhost:7012/api/checkMobileNumber',
        {
          mobileNumber: '+917850006956',
        },
      );
      console.log(response.data);
    } catch (err) {
      console.log('Error Details:', err);
        } finally {
      // setLoading(false);
    }
  };

  const handleGetOt = async (): Promise<void> => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showToast('error', 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (!termsAccepted) {
      showToast('error', 'Please accept the Terms of Use & Privacy Policy.');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare the payload
      const payload = {mobileNumber: selectedCountry.dialCode + phoneNumber};
      console.log('Payload:', payload); // Log the payload

      const response: ApiResponse<any> = await apiClient.post(
        '/checkMobileNumber',
        payload,
      );

      console.log('Response:', response); // Log the response

      if (response.status) {
        showToast('success', response.message);
        setIsOtpSent(true);
        setRemainingTime(30);
      } else {
        showToast('error', response.message);
      }
    } catch (error: any) {
      console.log('Error:', error); // Log any error that occurs
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<void> => {
    const otpRegex = /^\d{6}$/;
    const otpValue = otp.join('');

    if (!otpRegex.test(otpValue)) {
      showToast('error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setIsLoading(true);
      const response: ApiResponse<any> = await apiClient.post('/verifyOtp', {
        mobileNumber: selectedCountry?.dialCode + phoneNumber, // Use the selected country code
        otp: otpValue, // Use the entered OTP
      });

      if (response.status) {
        showToast('success', response.message);
        AsyncStorage.setItem('token', response.token);

        showToast('error', response.message);
      }
    } catch (error: any) {
      showToast(
        'error',
        'An error occurred while verifying OTP. Please try again.',
      ); // User-friendly message
      console.error('Error verifying OTP:', error); // Keep logging for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string): void => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleResendOtp = (): void => {
    setOtp(Array(6).fill(''));
    setIsOtpSent(true);
    setRemainingTime(30);
    // Implement resend OTP logic here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredCountries(filtered);
  };

  const handlePhoneNumberChange = (number: string) => {
    const cleaned = number.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    setFormattedPhoneNumber(
      cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
    );
  };

  const handleEditNumber = () => {
    setIsEditingNumber(true);
  };

  const handleSaveNumber = () => {
    setIsEditingNumber(false);
    setIsOtpSent(false);
    setOtp(Array(6).fill(''));
  };

  const handleCloseCountryModal = () => {
    setIsCountryModalVisible(false);
    setSearchQuery('');
    setFilteredCountries(countries);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isOtpSent ? 'Verify your mobile number' : 'Enter Your Mobile Number'}
        </Text>

        {!isOtpSent || isEditingNumber ? (
          <>
            {loadingCountries ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View style={styles.inputContainer}>
                <Text
                  style={styles.prefix}
                  onPress={() => setIsCountryModalVisible(true)}>
                  {selectedCountry?.dialCode}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={formattedPhoneNumber}
                  maxLength={12}
                  onChangeText={handlePhoneNumberChange}
                  placeholderTextColor="#888"
                />
              </View>
            )}
            {!isEditingNumber && (
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={termsAccepted}
                  onValueChange={setTermsAccepted}
                  tintColors={{true: '#fff', false: '#888'}}
                />
                <TouchableOpacity
                  onPress={() => setTermsAccepted(!termsAccepted)}>
                  <Text style={styles.checkboxText}>
                    I accept Terms of Use & Privacy Policy.
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={isEditingNumber ? handleSaveNumber : handleGetOtp}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isEditingNumber ? 'Save' : 'Get OTP'}
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.phoneNumberContainer}>
              <Text style={styles.phoneNumberText}>
                {selectedCountry?.dialCode} {formattedPhoneNumber}
              </Text>
              <TouchableOpacity onPress={handleEditNumber}>
                <MaterialIcons name="edit" size={24} color="#2196f3" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              Enter the code we have sent by WhatsApp
            </Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={ref => (otpInputsRef.current[index] = ref)}
                  value={digit}
                  onChangeText={value => handleOtpChange(index, value)}
                />
              ))}
            </View>

            <View style={styles.resendContainer}>
              <TouchableOpacity
                disabled={remainingTime > 0}
                onPress={handleResendOtp}>
                <Text
                  style={[
                    styles.resendText,
                    remainingTime > 0 && {color: '#555'},
                  ]}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
              <Text style={styles.timerText}>
                {`00:${remainingTime.toString().padStart(2, '0')}`}
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal
        isVisible={isCountryModalVisible}
        onBackdropPress={handleCloseCountryModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.7}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search country"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <ScrollView style={styles.countryList}>
            {filteredCountries.map((country, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedCountry(country);
                  handleCloseCountryModal();
                }}
                style={styles.countryItem}>
                <Text style={styles.countryName}>
                  {`${country.name} (${country.dialCode})`}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  prefix: {
    fontSize: 16,
    color: '#fff',
    paddingRight: 8,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    fontSize: 14,
    color: '#fff',
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    backgroundColor: '#202020',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    width: 40,
    height: 40,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    color: '#2196f3',
    fontSize: 14,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  searchInput: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
    marginBottom: 16,
  },
  countryList: {
    maxHeight: 300,
  },
  countryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  countryName: {
    fontSize: 16,
    color: '#fff',
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  phoneNumberText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default MobileVerification;
