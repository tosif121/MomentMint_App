import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, RefreshControl, ScrollView} from 'react-native';
import {showToast} from '../../utils/toast';
import {ApiResponse, User, Photo, ProfileScreenProps} from '../../utils/types';
import apiClient from '../../utils/api';
import ProfileHeader from './ProfileHeader';
import ProfileTopTab from './ProfileTopTab';

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      const userResponse: ApiResponse<User> = await apiClient.get(
        `/getUserById/${uid}`,
      );

      const photosResponse: ApiResponse<Photo[]> = await apiClient.get(
        `/posts`,
      );

      if (userResponse.status) {
        const filteredPosts =
          photosResponse.data &&
          photosResponse.data.filter(post => post.uid === uid);
        setUser(userResponse.user);
        setPhotos(filteredPosts);
      } else {
        throw new Error('Failed to fetch user data or photos');
      }
    } catch (err: any) {
      showToast('error', 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user) {
      await fetchData(user.id);
    }
    setRefreshing(false);
  }, [fetchData, user]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile', {user});
  }, [navigation, user]);

  const handleShareProfile = useCallback(() => {}, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#ffffff"
        />
      }>
      <ProfileHeader
        user={user}
        photosCount={photos.length}
        onEditProfile={handleEditProfile}
        onShareProfile={handleShareProfile}
      />
      {console.log(photos)}
      {photos && <ProfileTopTab photos={photos} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default ProfileScreen;
