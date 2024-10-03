import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CameraScreenProps} from '../../utils/types';
import {showToast} from '../../utils/toast';

const CameraScreen: React.FC<CameraScreenProps> = ({navigation}) => {
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<RNCamera | null>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({quality: 0.5});
        navigation.navigate('Preview', {imageUri: data.uri});
      } catch (error) {
        showToast('error', 'Failed to take picture. Please try again.');
        console.error('Failed to take picture:', error);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(prevType => (prevType === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(prevMode => (prevMode === 'off' ? 'on' : 'off'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={cameraType}
        flashMode={flashMode}
        androidCameraPermissionOptions={androidCameraPermissions}>
        <Controls
          flashMode={flashMode}
          onToggleFlash={toggleFlash}
          onToggleCameraType={toggleCameraType}
        />
        <CaptureButton onPress={takePicture} />
      </RNCamera>
    </SafeAreaView>
  );
};

const androidCameraPermissions = {
  title: 'Permission to use camera',
  message: 'We need your permission to use your camera',
  buttonPositive: 'Ok',
  buttonNegative: 'Cancel',
};

const Controls: React.FC<{
  flashMode: 'off' | 'on';
  onToggleFlash: () => void;
  onToggleCameraType: () => void;
}> = ({flashMode, onToggleFlash, onToggleCameraType}) => (
  <View style={styles.controlsContainer}>
    <TouchableOpacity onPress={onToggleFlash} style={styles.button}>
      {flashMode === 'off' ? (
        <MaterialIcons name="flash-off" size={24} color="#fff" />
      ) : (
        <MaterialIcons name="flash-on" size={24} color="#fff" />
      )}
    </TouchableOpacity>
    <TouchableOpacity onPress={onToggleCameraType} style={styles.button}>
      <MaterialIcons name="cameraswitch" size={24} color="#fff" />
    </TouchableOpacity>
  </View>
);

const CaptureButton: React.FC<{onPress: () => void}> = ({onPress}) => (
  <View style={styles.captureContainer}>
    <TouchableOpacity onPress={onPress} style={styles.capture}>
      <View style={styles.captureInner} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  captureContainer: {
    flex: 0,
    alignItems: 'center',
    marginBottom: 30,
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
});

export default CameraScreen;