import React, { useEffect, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./likedJobs.style";
import { COLORS } from "../../constants";
import LikedJobCard from "../common/cards/liked/likedJobsCard";
import AsyncStorageManager from "../AsyncStorageManager";

type JobObject = {
    key: string;
    value: any;
};

const LikedJobs = ({ focused }: any) => {
    const router = useRouter();
    const [likedJobsList, setLikedJobsList] = useState<any[]>([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleRetrieved = async () => {
        const retrievedItems = await AsyncStorageManager.getAllItemsFromStorage();
        if (retrievedItems) {
            const LikedJobs = retrievedItems.length > 0;
            if (LikedJobs) {
                setLikedJobsList(retrievedItems)
                setIsLoading(false)
            }
        } else {
            console.log('No items retrieved from storage.');
            setError(true)
        }
    };

    // const handleDelete = async () => {
    //     deleteJobFromStorage('job_data')
    // }

    // const deleteJobFromStorage = async (key: string) => {
    //     try {
    //         await AsyncStorage.removeItem(key);
    //         console.log(`Data with key '${key}' removed successfully`);
    //     } catch (error) {
    //         console.error(`Error removing data with key '${key}':`, error);
    //         throw error;
    //     }
    // };

    useEffect(() => {
        handleRetrieved();
    }, [])

    function filterJobData(data: JobObject[]): JobObject[] {
        return data.filter((item) => item.key === "job_data");
    }

    const jobLikedResult = filterJobData(likedJobsList) || [];

    const jobLikedResultValue = jobLikedResult.map((item) => {
        const value = item.value;
        return value;
    });

    // console.log(jobLikedResultValue, 'filteredArray')

    return (
        <View style={styles.container}>
            <View style={styles.cardsContainer}>
                {/* <TouchableOpacity onPress={handleDelete}>
                    <Text>Remove Data</Text>
                </TouchableOpacity> */}
                {isLoading ? (
                    <ActivityIndicator size='large' color={COLORS.primary} />
                ) : error ? (
                    <Text style={{ marginHorizontal: 20 }}>Something went wrong</Text>
                ) : jobLikedResultValue.flat().length === 0 ? (
                    <Text>No Saved Jobs</Text>
                ) : (
                    jobLikedResultValue.flat()?.map((job: { jobId: any; liked: boolean }) => (
                        <LikedJobCard
                            job={job}
                            key={`liked-job-${job.jobId}`}
                            liked={job.liked}
                            // handleNavigate={() => router.push(`/liked/job-details/${job.jobId}`)}
                            handleNavigate={() => {
                                router.push({ pathname: `/liked/job-details/${job.jobId}`, params: { liked: job.liked.toString() } });
                            }}
                        />
                    ))
                )}
            </View>
        </View>
    );
};

export default LikedJobs;