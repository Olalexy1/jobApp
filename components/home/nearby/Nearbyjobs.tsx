import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import styles from "./nearbyjobs.style";
import { COLORS } from "../../../constants";
import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard";
import { useGetJobsSearchQuery } from "../../../services/jobsApi";
import { countryNameToCodeMap, calculateDestinationCoordinates } from "../../../utils";
import * as Location from 'expo-location';

const NearByJobs = () => {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | ''>('');
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_KEY

  const searchParams = {
    query: 'React developer in Nigeria',
    num_pages: '1',
    country: country || '',
  }

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Fetch country information using reverse geocoding
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=AIzaSyD5lUokXK7izSWBI_mfTClS5jYaMLr6YK8`);
      const data = await response.json();

      if (data.results.length > 0) {
        const countryData = data.results.find((result: { types: string | string[]; }) =>
          result.types.includes('country')
        );
        if (countryData) {
          const countryName = countryData.formatted_address;
          setCountry(countryName);

          // Convert country name to ISO 3166-1 alpha-2 code using the map
          const countryCode = countryNameToCodeMap[countryName];
          setCountryCode(countryCode || 'Not Found');

          // Calculate coordinates within a radius from the user's location
          const userLatitude = location.coords.latitude;
          const userLongitude = location.coords.longitude;
          const radiusInKm = 10; // Example radius in kilometers
          const numberOfPoints = 12; // Example number of points to generate

          const points = [];
          for (let i = 0; i < numberOfPoints; i++) {
            const angle = (360 / numberOfPoints) * i;
            const { latitude, longitude } = calculateDestinationCoordinates(
              userLatitude,
              userLongitude,
              radiusInKm,
              angle
            );
            points.push({ latitude, longitude });
          }

          // console.log('Generated points:', points);

        }
      }
    })();
  }, []);

  let text = 'Loading...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // console.log(location, country, countryCode, 'location')

  const { data: jobSearchData, isLoading, error } = useGetJobsSearchQuery(searchParams);

  const jobSearchResult = jobSearchData?.data || [];

  // console.log(jobSearchData, 'nearby')



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby jobs</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          jobSearchResult?.map((job: { job_id: any; }) => (
            <NearbyJobCard
              job={job}
              key={`nearby-job-${job.job_id}`}
              handleNavigate={() => router.push(`/home/job-details/${job.job_id}`)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default NearByJobs;