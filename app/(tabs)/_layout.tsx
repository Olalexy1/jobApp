import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs, useFocusEffect } from 'expo-router';
import { COLORS, FONT, SIZES } from "../../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorageManager from '../../components/AsyncStorageManager';

type JobObject = {
  key: string;
  value: any;
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  solid?: boolean;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [likedJobsList, setLikedJobsList] = useState<any[]>([]);
  const isFocused = useIsFocused();

  const getAllItemsFromStorage = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allItems = await AsyncStorage.multiGet(allKeys);

      // Parse each item's value from JSON
      const parsedItems = allItems.map(([key, value]) => {
        return { key, value: JSON.parse(value || 'null') };
      });

      return parsedItems;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const handleRetrieved = async () => {
    const retrievedItems = await getAllItemsFromStorage();
    if (retrievedItems) {
      const LikedJobs = retrievedItems.length > 0;
      if (LikedJobs) {
        setLikedJobsList(retrievedItems)
      }
    } else {
      // console.log('No items retrieved from storage.');
    }
  };

  // AsyncStorageManager.addListener('storageChange', handleRetrieved);

  useEffect(() => {
    if (isFocused) {
       console.log('In inFocused Block', isFocused);
       handleRetrieved()
    }
  }, [isFocused]);

  function filterJobData(data: JobObject[]): JobObject[] {
    return data.filter((item) => item.key === "job_data");
  }

  let jobLikedResult = filterJobData(likedJobsList) || [];

  console.log(likedJobsList, jobLikedResult, 'jobLikedResult')

  let jobLikedResultValue = jobLikedResult.map((item) => {
    const value = item.value;
    return value;
  });

  let likedJobsNo = jobLikedResultValue.flat().length

  console.log(likedJobsNo, 'likedJobsNo')

  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarActiveTintColor: "#407BFF",
        tabBarShowLabel: false,
        headerShown: false
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: 'Like',
          tabBarIcon: ({ focused, color }) => <TabBarIcon name="heart" solid={true} color={color} />,
          tabBarBadge: likedJobsNo, ///
          tabBarBadgeStyle: { backgroundColor: COLORS.tertiary, fontWeight: '600' }
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
