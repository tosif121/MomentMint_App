import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  PhoneNumberInput: undefined;
  OTPVerification: {phoneNumber: string};
};

export type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export type PhoneNumberInputScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PhoneNumberInput'
>;

export type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OTPVerification'
>;

export type OTPVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'OTPVerification'
>;

export type PhoneNumberInputScreenProps = {
  navigation: PhoneNumberInputScreenNavigationProp;
};

export type OTPVerificationScreenProps = {
  navigation: OTPVerificationScreenNavigationProp;
  route: OTPVerificationScreenRouteProp;
};
export type SplashScreenProps = {
  navigation: SplashScreenNavigationProp;
};

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
