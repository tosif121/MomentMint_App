import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  MobileVerification: undefined;
};

export type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export type MobileVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MobileVerification'
>;

export type MobileVerificationScreenProps = {
  navigation: MobileVerificationScreenNavigationProp;
};

export type SplashScreenProps = {
  navigation: SplashScreenNavigationProp;
};

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
