import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MobileVerification from './src/screen/MobileVerification';
import {RootStackParamList} from './src/utils/types';
import SplashScreen from './src/screen/SplashScreen';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false, animationEnabled: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen
          name="MobileVerification"
          component={MobileVerification}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
