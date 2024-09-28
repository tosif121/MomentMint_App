import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PhoneNumberInputScreen from './src/screen/PhoneNumberInputScreen';
import OTPVerificationScreen from './src/screen/OTPVerificationScreen';
import {RootStackParamList} from './src/utils/types';
import SplashScreen from './src/screen/SplashScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false, animationEnabled: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen
          name="PhoneNumberInput"
          component={PhoneNumberInputScreen}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
