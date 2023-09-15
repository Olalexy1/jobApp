import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS, FONT, SIZES, icons } from "../../../constants";
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { ScreenHeaderBtn, LikedJobs } from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageManager from '../../../components/AsyncStorageManager';

const Liked = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [likedJobsList, setLikedJobsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRetrieved = async () => {
    const retrievedItems = await AsyncStorageManager.getAllItemsFromStorage();
    if (retrievedItems) {
      const LikedJobs = retrievedItems.length > 0;
      if (LikedJobs) {
        setLikedJobsList(retrievedItems)
        setIsLoading(false)
      }
    } else {
      // console.log('No items retrieved from storage.');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsLoading(true)
    handleRetrieved()
    setRefreshing(false)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension='60%'
              handlePress={() => router.back()}
            />
          ),
          headerTitle: "Liked Jobs",
          headerTitleAlign: 'center'
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View
          style={styles.scrollInnerContainer}>
          {isLoading ? (
            <ActivityIndicator size='large' color={COLORS.primary} />
          ) : (
            <LikedJobs />
          )
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    // ...Platform.select({
    //   android: {
    //     paddingTop:5,
    //   },
    // }),
  },
  scrollInnerContainer: {
    flex: 1,
    padding: SIZES.medium,
  },
});

export default Liked