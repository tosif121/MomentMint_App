import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={require('./../images/logo.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default Header;
