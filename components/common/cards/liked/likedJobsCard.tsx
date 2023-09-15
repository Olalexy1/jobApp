import React from 'react'
import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./likedJobsCard.style";
import { checkImageURL } from "../../../../utils";

interface LikedJobCardProps {
  job: any;
  handleNavigate: () => void;
  liked?: boolean
}

const LikedJobCard: React.FC<LikedJobCardProps> = ({ job, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() =>handleNavigate()}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={{
            uri: checkImageURL(job?.jobLogo)
              ? job.jobLogo
              : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          }}
          resizeMode='contain'
          style={styles.logImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {job?.jobTitle}
        </Text>
        <Text style={styles.jobType}>{job?.jobType}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LikedJobCard;