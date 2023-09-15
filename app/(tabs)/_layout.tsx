import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs, useFocusEffect } from 'expo-router';
import { COLORS, FONT, SIZES } from "../../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorageManager, { AsyncStorageEvent } from '../../components/AsyncStorageManager';

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
  const [likedJobsNo, setLikedJobsNo] = useState<number>(0);


  const handleRetrieved = async () => {
    const retrievedItems = await AsyncStorageManager.getAllItemsFromStorage();
    if (retrievedItems) {
      const jobDataItems = retrievedItems.filter(item => item.key === "job_data");
      if (jobDataItems.length > 0) {
        setLikedJobsList(jobDataItems[0].value);
      }
    } else {

    }
  };

  useEffect(() => {
    handleRetrieved();

    AsyncStorageManager.addListener('jobAppended', handleRetrieved);

    return () => {
      AsyncStorageManager.removeListener('jobAppended', handleRetrieved);
    };

  }, [ ]);

  useEffect(() => {
    setLikedJobsNo(jobLikedResultValue.length);
  }, [isFocused, likedJobsList]);

  function filterJobData(data: JobObject[]): JobObject[] {
    return data.filter((item) => item.key === "job_data");
  }


  // let jobLikedResult = filterJobData(likedJobsList) || [];

  let jobLikedResultValue = likedJobsList?.map((item) => {
    const value = item.value;
    return value;
  });

  // let likedJobsNo = jobLikedResultValue.length

  // console.log(likedJobsList, likedJobsNo, 'likedJobsNo', isFocused)

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
