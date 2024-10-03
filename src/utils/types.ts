import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  MobileVerification: undefined;
  MainTabs: undefined;
  Preview: {imageUri: string};
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Camera: undefined;
  Profile: undefined;
};

export type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export type MobileVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MobileVerification'
>;

export type ProfilesScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'Profile'
>; // Updated to use MainTabParamList

export type CameraScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'Camera'
>; // Removed extra argument

export interface CameraScreenProps {
  navigation: CameraScreenNavigationProp;
  route: {
    params: {
      imageUri: string;
    };
  };
}

export interface ProfileHeaderProps {
  user: {photoURL?: string};
  photosCount: number;
}

export type MobileVerificationScreenProps = {
  navigation: MobileVerificationScreenNavigationProp;
};

export type SplashScreenProps = {
  navigation: SplashScreenNavigationProp;
};

export type ProfileScreenProps = {
  navigation: ProfilesScreenNavigationProp;
};

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  token?: string;
  error?: string;
}

export interface ApiErrorResponse {
  status: false;
  message: string;
  error: string;
}
