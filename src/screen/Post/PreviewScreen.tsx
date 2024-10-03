import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {CameraScreenProps} from '../../utils/types';
import {showToast} from '../../utils/toast';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const activities = {
  'At Collage': '🎓',
  'At Farm': '🌾',
  'At Home': '🏠',
  'At Temple': '🕌',
  'At Traffic': '🚦',
  Attending: '🎟️',
  Baking: '🍞',
  Celebration: '🎉',
  Chilling: '🛋️',
  'Class Bunk': '🏫❌',
  Cleaning: '🧹',
  Communting: '🚇',
  Going: '🚶‍♂️',
  Grooming: '💇‍♂️',
  Hangout: '👯‍♂️',
  'Independence Day': '🇮🇳',
  Janmashtami: '🎊',
  Learning: '📚',
  Listening: '🎧',
  Meditating: '🧘‍♂️',
  Cooking: '🍳',
  Cycling: '🚴‍♀️',
  Dancing: '💃',
  Designing: '🎨',
  Drinking: '🍹',
  Eating: '🍽️',
  Engagement: '💍',
  Enjoying: '😊',
  Exercising: '🏋️‍♂️',
  Gaming: '🎮',
  'Ganesh Chaturthi': '🐘',
  Gardening: '🌿',
  Meeting: '👥',
  Nothing: '😴',
  Partying: '🥳',
  'Playing Garba': '🪔',
  Playing: '🎲',
  Praying: '🙏',
  Rafting: '🚣‍♂️',
  Reading: '📖',
};

const {width, height} = Dimensions.get('window');

const PreviewScreen: React.FC<CameraScreenProps> = ({route, navigation}) => {
  const {imageUri} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState(
    Object.keys(activities),
  );

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleConfirm = async () => {
    if (!selectedActivity) {
      showToast('error', 'Please select an activity.');
      setIsModalVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      await uploadImageAndSaveData();
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error saving image and activity:', error);
      showToast('error', 'Failed to save data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImageAndSaveData = async () => {
    if (!currentUser) {
      console.error('No user logged in');
      showToast('error', 'Please log in first');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    formData.append('userId', currentUser.uid);
    formData.append('uploadType', 'post');
    formData.append('activity', selectedActivity);

    try {
      const response = await axios.post(
        `http://15.207.26.134:7012/api/uploadImage`,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      showToast('success', response.data.message);
    } catch (error) {
      console.error('Upload error:', error);
      showToast('error', 'Upload failed');
    }
  };

  const handleActivitySelect = (activityName: string) => {
    setSelectedActivity(
      activityName === 'Custom Activity' ? searchQuery.trim() : activityName,
    );
    setIsModalVisible(false);
    setSearchQuery('');
  };

  useEffect(() => {
    setFilteredActivities(
      Object.keys(activities).filter(activity =>
        activity.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    );
  }, [searchQuery]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageUri}}
          style={styles.image}
          resizeMode="cover"
        />
        {selectedActivity && (
          <TouchableOpacity
            style={styles.activityBadge}
            onPress={() => setIsModalVisible(true)}>
            <Text style={styles.activityBadgeText}>
              {activities[selectedActivity]} {selectedActivity}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleConfirm}
          style={[
            styles.button,
            styles.postButton,
            isLoading && styles.disabledButton,
          ]}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>What are you doing?</Text>
          <View style={styles.searchContainer}>
            <MaterialIcons
              name="search"
              size={24}
              color="#ffffff"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Activities..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView style={styles.scrollView}>
            {filteredActivities.map(activity => (
              <TouchableOpacity
                key={activity}
                style={styles.activityButton}
                onPress={() => handleActivitySelect(activity)}>
                <Text style={styles.activityText}>
                  {activities[activity]} {activity}
                </Text>
              </TouchableOpacity>
            ))}
            {searchQuery && !filteredActivities.includes(searchQuery) && (
              <TouchableOpacity
                style={styles.activityButton}
                onPress={() => handleActivitySelect('Custom Activity')}>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityText}>{searchQuery}</Text>
                  <MaterialIcons name="add" size={24} color="#2196f3" />
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width,
    height,
  },
  activityBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#00c6ff',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activityBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4c4c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#2196f3',
    width: '48%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  gradient: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  modalContainer: {
    backgroundColor: '#000',
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 100,
    width: '100%',
    height: '93%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#ffffff',
  },
  modal: {
    margin: 0,
  },
  scrollView: {
    flexGrow: 1,
    width: '100%',
  },
  activityButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#111111',
    marginBottom: 10,
    width: width * 0.9,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    width: '100%',
  },

  activityTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  searchIcon: {
    color: '#ffffff',
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    marginLeft: 10,
  },
});

export default PreviewScreen;
