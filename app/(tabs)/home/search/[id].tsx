import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native'
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import { Text, SafeAreaView } from 'react-native';

import { ScreenHeaderBtn, NearbyJobCard } from '../../../../components';
import { COLORS, icons, SIZES } from '../../../../constants';
import styles from '../../../../styles/search';
import { useGetJobsSearchQuery } from '../../../../services/jobsApi';

const JobSearch = () => {
    const params = useGlobalSearchParams();
    const router = useRouter()
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [page, setPage] = useState(1);

    const JobSearchParams = {
        query: params.id,
        page: page,
        // num_pages: 1,
        date_posted: 'all',
        remote_jobs_only: false,
    }

    const { data: jobSearchData, isLoading, error, isFetching } = useGetJobsSearchQuery(JobSearchParams);

    const jobSearchResult = jobSearchData?.data || [];

    const handlePagination = (direction: string) => {
        if (direction === 'left' && page > 1) {
            setPage(page - 1)
            // console.log(page, 'left')

        } else if (direction === 'right') {
            setPage(page + 1)
            
            // console.log(page, 'right')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.left}
                            dimension='60%'
                            handlePress={() => router.back()}
                        />
                    ),
                    headerTitle: "",
                }}
            />

            {isLoading || isFetching ? (
                <ActivityIndicator size='large' color={COLORS.primary} />
            ) : error ? (
                <Text>Something went wrong</Text>
            ) : (

                <FlatList
                    data={jobSearchResult}
                    renderItem={({ item }) => (
                        <NearbyJobCard
                            job={item}
                            handleNavigate={() => router.push(`/job-details/${item.job_id}`)}
                        />
                    )}
                    keyExtractor={(item) => item.job_id}
                    contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
                    ListHeaderComponent={() => (
                        <>
                            <View style={styles.container}>
                                <Text style={styles.searchTitle}>{params.id}</Text>
                                <Text style={styles.noOfSearchedJobs}>Job Opportunities</Text>
                            </View>
                            <View style={styles.loaderContainer}>
                                {searchLoader ? (
                                    <ActivityIndicator size='large' color={COLORS.primary} />
                                ) : searchError && (
                                    <Text>Oops something went wrong</Text>
                                )}
                            </View>
                        </>
                    )}
                    ListFooterComponent={() => (
                        <View style={styles.footerContainer}>
                            <TouchableOpacity
                                style={styles.paginationButton}
                                onPress={() => handlePagination('left')}
                            >
                                <Image
                                    source={icons.chevronLeft}
                                    style={styles.paginationImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <View style={styles.paginationTextBox}>
                                <Text style={styles.paginationText}>{page}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.paginationButton}
                                onPress={() => handlePagination('right')}
                            >
                                <Image
                                    source={icons.chevronRight}
                                    style={styles.paginationImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    )
}

export default JobSearch