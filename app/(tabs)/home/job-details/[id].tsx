import React from "react";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Share
} from "react-native";

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../../../components";
import { COLORS, icons, SIZES } from "../../../../constants";
import { useGetJobDetailsQuery } from "../../../../services/jobsApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const params = useGlobalSearchParams();
  const router = useRouter();

  const JobDetailsParams = {
    job_id: params.id,
    extended_publisher_details: 'true',
  }

  const { data: jobDetailsData, isLoading, error, refetch } = useGetJobDetailsQuery(JobDetailsParams);

  const jobDetails = jobDetailsData?.data || [];

  // console.log(jobDetails, 'Job Details')

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch()
    setRefreshing(false)
  }, []);


  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return (
          <Specifics
            title='Qualifications'
            points={jobDetails[0].job_highlights?.Qualifications ?? ["N/A"]}
          />
        );

      case "About":
        return (
          <JobAbout info={jobDetails[0].job_description ?? "No data provided"} />
        );

      case "Responsibilities":
        return (
          <Specifics
            title='Responsibilities'
            points={jobDetails[0].job_highlights?.Responsibilities ?? ["N/A"]}
          />
        );

      default:
        return null;
    }
  };

  const jobTitle: string = jobDetails[0]?.job_title;
  const jobLink: string = jobDetails[0]?.job_google_link ?? 'https://careers.google.com/jobs/results/'
  const jobLogo: string = jobDetails[0]?.employer_logo;
  const jobType: string = jobDetails[0]?.job_employment_type;

  const shareText = async () => {
    try {
      const result = await Share.share({
        title: jobTitle,
        message: jobLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType){
          console.log('Shared with activity type of: ', result.activityType)
        } else {
          console.log('Shared successfully');
        } 
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleClicked = async () => {
    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
  
      const jobData = {
        jobId: params.id,
        jobTitle: jobTitle,
        jobLink: jobLink,
        jobLogo: jobLogo,
        jobType: jobType,
        liked: true
      };
  
      try {
        if (newIsLiked) {
          appendJobToStorage('job_data', jobData);
        } else {
          deleteJobFromStorage('job_data');
        }
        console.log('Data operation completed successfully');
      } catch (error) {
        console.error('Error with data operation:', error);
      }
  
      return newIsLiked;
    });
  };

  // const saveJobToStorage = async (key: string, value: any) => {
  //   try {
  //     await AsyncStorage.setItem(key, JSON.stringify(value));
  //     console.log('Data saved successfully');
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //     throw error;
  //   }
  // };

  const appendJobToStorage = async (key: string, value: any) => {
    try {
      // Retrieve the existing data from local storage
      const existingData = await AsyncStorage.getItem(key);
  
      // Parse the existing data (or initialize an empty array if it's the first time)
      let existingArray = existingData ? JSON.parse(existingData) : [];
  
      // Check if the existing data is an array; if not, create an array with the existing value
      if (!Array.isArray(existingArray)) {
        existingArray = [existingArray];
      }
  
      // Append the new value to the existing array
      existingArray.push(value);
  
      // Save the updated array back to local storage
      await AsyncStorage.setItem(key, JSON.stringify(existingArray));
      console.log('Data appended successfully');
    } catch (error) {
      console.error('Error appending data:', error);
      throw error;
    }
  };
  

  const deleteJobFromStorage = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Data with key '${key}' removed successfully`);
    } catch (error) {
      console.error(`Error removing data with key '${key}':`, error);
      throw error;
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
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
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension='60%' handlePress={shareText} />
          ),
          headerTitle: "  Job Details",
        }}
      />

      <>
        <ScrollView showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {isLoading ? (
            <ActivityIndicator size='large' color={COLORS.primary} />
          ) : error ? (
            <Text style={{marginHorizontal: 20}}>Something went wrong</Text>
          ) : jobDetailsData.length === 0 ? (
            <Text style={{marginHorizontal: 20}}>No data available</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={jobDetails[0].employer_logo}
                jobTitle={jobDetails[0].job_title}
                companyName={jobDetails[0].employer_name}
                location={jobDetails[0].job_country}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        <JobFooter url={jobDetails[0]?.job_google_link ?? 'https://careers.google.com/jobs/results/'} handlePress={handleClicked} liked={isLiked}/>
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
