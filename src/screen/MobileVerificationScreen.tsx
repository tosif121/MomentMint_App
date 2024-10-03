import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import {showToast} from '../utils/toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import apiClient from '../utils/api';
import {ApiResponse, RootStackParamList} from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface Country {
  name: string;
  dialCode: string;
  code: string;
}

const RESEND_TIMER_SECONDS = 60;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MobileVerificationScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] =
    useState<number>(RESEND_TIMER_SECONDS);
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (isOtpSent && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }

    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [isOtpSent, remainingTime]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data: any[] = await response.json();
      const formattedCountries: Country[] = data.map((country: any) => ({
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
        mobileNumber: selectedCountry?.dialCode + phoneNumber,
        otp: otpValue,
      });
      if (response.data.status) {
        showToast('success', response.data.message);
        navigation.replace('MainTabs');
        if (response.data.token) {
          await AsyncStorage.setItem('token', response.data.token);
        } else {
          console.error('Token is undefined');
        }
      } else {
        showToast('error', response.data.message);
        setOtp(Array(6).fill(''));
        otpInputsRef.current[0]?.focus();
      }
    } catch (error: any) {
      showToast(
        'error',
        'An error occurred while verifying OTP. Please try again.',
      );
      setOtp(Array(6).fill(''));
      otpInputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseCountryModal = (): void => {
    setIsCountryModalVisible(false);
    setSearchQuery('');
    setFilteredCountries(countries);
  };

  const handleSearch = (query: string): void => {
    setSearchQuery(query);

    if (query === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredCountries(filtered);
    }
  };

  const handleOtpKeyPress = (index: number, key: string): void => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const updatedOtp = [...otp];
      updatedOtp[index - 1] = '';
      setOtp(updatedOtp);
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string): void => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value) {
      if (index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
      }
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handlePhoneNumberChange = (number: string) => {
    const cleaned = number.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    setFormattedPhoneNumber(
      cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
    );
  };

  const handleEditNumber = () => {
    setIsEditingNumber(true);
    setIsOtpSent(false);
    setOtp(Array(6).fill(''));
  };

  const handleSaveNumber = () => {
    setIsEditingNumber(false);
    setIsOtpSent(false);
    setOtp(Array(6).fill(''));
    handleGetOtp();
  };

  const handleGetOtp = async (): Promise<void> => {
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
      const payload = {mobileNumber: selectedCountry?.dialCode + phoneNumber};
      const response: ApiResponse<any> = await apiClient.post(
        '/checkMobileNumber',
        payload,
      );
      if (response.data.status) {
        showToast('success', response.data.message || 'send otp on whatsapp');
        setIsOtpSent(true);
        startResendTimer();
      } else {
        showToast('error', response.data.message);
      }
    } catch (error: any) {
      showToast('error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const response: ApiResponse<any> = await apiClient.post(
        '/checkMobileNumber',
        {
          mobileNumber: selectedCountry?.dialCode + phoneNumber,
        },
      );

      if (response.data.status) {
        showToast('success', 'OTP resent successfully');
        setOtp(Array(6).fill(''));
        startResendTimer();
      } else {
        showToast('error', response.data.message || 'Failed to resend OTP.');
      }
    } catch (error: any) {
      showToast('error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startResendTimer = () => {
    setRemainingTime(RESEND_TIMER_SECONDS);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isOtpSent && !isEditingNumber
            ? 'Verify your mobile number'
            : 'Enter Your Mobile Number'}
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
                  ref={ref => (otpInputsRef.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={value => handleOtpChange(index, value)}
                  onKeyPress={({nativeEvent: {key}}) =>
                    handleOtpKeyPress(index, key)
                  }
                  selectTextOnFocus
                />
              ))}
            </View>

            <View style={styles.resendContainer}>
              {remainingTime > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in {formatTime(remainingTime)}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={isLoading}
                  style={styles.resendButton}>
                  <Text
                    style={[
                      styles.resendText,
                      isLoading && styles.resendTextDisabled,
                    ]}>
                    Resend verification code
                  </Text>
                </TouchableOpacity>
              )}
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
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#101010',
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
  otpInput: {
    backgroundColor: '#202020',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    width: 45,
    height: 45,
    borderRadius: 8,
    marginHorizontal: 4,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  timerText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    color: '#2196f3',
    fontSize: 14,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#555',
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

export default MobileVerificationScreen;
