import {faComment, faHeart} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import moment from 'moment';

const PostScreen = ({photos}) => {
  const renderItem = ({item}) => (
    <View style={styles.photoContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PhotoDetails', {photoId: item.id})}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.imageUri}} style={styles.photo} />
          <View style={styles.overlay}>
            <Text style={styles.activity}>{item.activity}</Text>
          </View>
        </View>
        <View style={styles.postDetails}>
          <Text style={styles.createdAt}>
            {moment(item.createdAt).fromNow()}
          </Text>
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={faHeart} size={20} color="#FF4724" />
              <Text style={styles.iconText}>{item.likes}</Text>
            </View>
            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={faComment} size={20} color="#2196f3" />
              <Text style={styles.iconText}>{item.comments}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {photos.length === 0 ? (
        <Text style={styles.bio}>No moments to display</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={item => item.id.toString()}
          numColumns={1}
          renderItem={renderItem}
          contentContainerStyle={styles.photoList}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => {}} />
          }
        />
      )}
    </View>
  );
};

const TagScreen = () => {
  return (
    <View style={styles.tagScreenContainer}>
      <Text style={styles.text}>Tag Content goes here</Text>
    </View>
  );
};

const ProfileTopTab = ({photos}) => {
  const [activeTab, setActiveTab] = useState('Post');

  const renderContent = () => {
    switch (activeTab) {
      case 'Post':
        return <PostScreen photos={photos} />;
      case 'Tag':
        return <TagScreen />;
      default:
        return <PostScreen photos={photos} />;
    }
  };

  return (
    <View style={styles.profileScreenContainer}>
      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Post' && styles.activeTabItem]}
          onPress={() => setActiveTab('Post')}>
          <Image
            source={require('../../images/pixels.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Tag' && styles.activeTabItem]}
          onPress={() => setActiveTab('Tag')}>
          <Image source={require('../../images/tag.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Render Screen Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  profileScreenContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activity: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  createdAt: {
    fontSize: 12,
    color: '#666',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-around',
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
  },
  activeTabItem: {
    borderBottomColor: '#ffffff',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ProfileTopTab;
