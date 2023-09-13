import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


import styles from "./footer.style";
import { Icon } from '@rneui/themed';

const Footer = ({ url, handlePress }: any) => {
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const handleClicked = async () => {
    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
  
      const jobData = {
        jobId: 'John Doe',
        jobTitle: 'john@example.com',
      };
  
      try {
        if (newIsLiked) {
          saveJobToStorage('user_data', jobData);
        } else {
          deleteJobFromStorage('user_data');
        }
        console.log('Data operation completed successfully');
      } catch (error) {
        console.error('Error with data operation:', error);
      }
  
      return newIsLiked;
    });
  };
  

  const saveJobToStorage = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
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

  const getJobFromStorage = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const handleRetrieved = async () => {
    const retrievedData = await getJobFromStorage('user_data');
    if (retrievedData) {
      console.log('Retrieved data:', retrievedData);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn}
        onPress={handleClicked}
      >
        <Icon
          name='heart'
          solid={isLiked}
          type="font-awesome-5"
          color="#407BFF"
        />
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.likeBtn}
        onPress={handleRetrieved}
      >
        <Icon
          name='user'
          type="font-awesome-5"
          color="#407BFF"
        />
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() => Linking.openURL(url)}
      >
        <Text style={styles.applyBtnText}>Apply for job</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;