import React, { useEffect } from "react";
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
  ScreenHeader
} from "../../../../components";
import { COLORS, icons, SIZES } from "../../../../constants";
import { useGetJobDetailsQuery } from "../../../../services/jobsApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageManager from "../../../../components/AsyncStorageManager";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const params = useGlobalSearchParams();
  const router = useRouter();

  const liked = params.liked;

  const [initialLike, setInitialLike] = useState(liked)

  console.log(initialLike, 'params')

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
  const [likedJobsList, setLikedJobsList] = useState<any[]>([]);

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

  const jobTitle: string = jobDetails[0]?.job_title ?? 'Job Title';
  const jobLink: string = jobDetails[0]?.job_google_link ?? 'https://careers.google.com/jobs/results/';
  const jobLogo: string = jobDetails[0]?.employer_logo ?? 'https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg';
  const jobType: string = jobDetails[0]?.job_employment_type ?? '';

  const shareText = async () => {
    try {
      const result = await Share.share({
        title: jobTitle,
        message: jobLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
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
    setInitialLike('false')
    setIsLiked((prevIsLiked) => {

      const newIsLiked = !prevIsLiked;
      // setIsLiked((prevIsLiked) => !prevIsLiked);

      const jobData = {
        jobId: params.id,
        jobTitle: jobTitle,
        jobLink: jobLink,
        jobLogo: jobLogo,
        jobType: jobType,
        liked: true,
      };

      try {
        if (newIsLiked) {
          AsyncStorageManager.appendJobToStorage('job_data', jobData);
        } else {
          AsyncStorageManager.removeSpecificJobFromStorage('job_data', jobData);
        }
        console.log('Data operation completed successfully');
      } catch (error) {
        console.error('Error with data operation:', error);
      }

      return newIsLiked;
    });
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
          headerTitle: "Job Details",
          headerTitleAlign: 'center'
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
            <Text style={{ marginHorizontal: 20 }}>Something went wrong</Text>
          ) : jobDetailsData.length === 0 ? (
            <Text style={{ marginHorizontal: 20 }}>No data available</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={jobDetails[0]?.employer_logo ?? "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg"}
                jobTitle={jobDetails[0]?.job_title}
                companyName={jobDetails[0]?.employer_name}
                location={jobDetails[0]?.job_country}
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

        <JobFooter url={jobDetails[0]?.job_google_link ?? 'https://careers.google.com/jobs/results/'} handlePress={handleClicked} liked={initialLike === 'true' ? true : isLiked} />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
