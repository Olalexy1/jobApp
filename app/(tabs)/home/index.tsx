import { useState } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";

import { COLORS, SIZES } from "../../../constants";
import {
  NearByJobs,
  PopularJobs,
  Welcome,
} from "../../../components";

const Home = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerShown: false
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={styles.scrollInnerContainer}
        >
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={() => {
              if (searchTerm) {
                router.push(`/home/search/${searchTerm}`)
              }
            }}
          />
          <PopularJobs />
          <NearByJobs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollInnerContainer: {
    flex: 1,
    padding: SIZES.medium,
    ...Platform.select({
      android: {
        paddingTop: 45, 
        // borderWidth: 1,
        // borderColor: 'red'
      },
    }),
  }
});

export default Home;