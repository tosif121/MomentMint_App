import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import {ProfileHeaderProps} from '../../utils/types';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({user, photosCount}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            user?.photoURL
              ? {uri: user.photoURL}
              : (require('../../images/pic.png') as ImageSourcePropType)
          }
          style={[styles.profileImage]}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.username}>
            {user?.displayName || 'Anonymous'}
          </Text>
          <Text style={styles.handle}>@{user?.userName}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <View style={styles.streakContainer}>
            <Image
              source={require('../../images/flash.png')}
              style={styles.icon}
              width={10}
              height={10}
            />
            <Text style={styles.iconText}>{user?.streak}</Text>
          </View>
          <View style={styles.iconsContainer}>
            <Image
              source={require('../../images/star.png')}
              style={styles.icon}
            />
            <Text style={styles.iconText}>{user?.coins}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{photosCount}</Text>
          <Text style={styles.statLabel}>Moments</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.followersCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{user?.bio || 'Mint for the moment'}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Share Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPlus}>
          <MaterialIcons name="person-add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  handle: {
    color: '#aaa',
    fontSize: 16,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconText: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  bioContainer: {
    marginVertical: 20,
  },
  bioText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 25,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  button: {
    flex: 1,
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPlus: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 50,
    width: 45,
    height: 45,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileHeader;