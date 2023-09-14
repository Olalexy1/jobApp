import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";


import styles from "./footer.style";
import { Icon } from '@rneui/themed';

const Footer = ({ url, handlePress, liked }: any) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn}
        onPress={handlePress}
      >
        <Icon
          name='heart'
          solid={liked}
          type="font-awesome-5"
          color="#407BFF"
        />
      </TouchableOpacity>

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