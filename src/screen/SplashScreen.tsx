import React, {useEffect} from 'react';
import {Text, Image, StyleSheet, Animated} from 'react-native';
import {SplashScreenProps} from '../utils/types';

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const timer = setTimeout(() => {
      navigation.replace('MobileVerification');
    }, 3000);

    fadeIn.start();

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Image source={require('./../images/logo.png')} style={styles.image} />
      <Text style={styles.text}>Moment Mint</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    marginTop: 20,
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
  },
});

export default SplashScreen;
