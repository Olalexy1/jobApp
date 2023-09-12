import { useState } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";

import { COLORS, SIZES } from "../../../constants";
import {
  NearByJobs,
  PopularJobs,
  ScreenHeaderBtn,
  Welcome,
  AvatarBtn
} from "../../../components";

import { avatarLetters } from "../../../utils";
import { AuthStore } from "../../../firebase";

const Home = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const avatar = AuthStore.getRawState().user?.displayName?.toString()
  const letterAvatar = avatarLetters(avatar)

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          // headerLeft: () => (
          //   <AvatarBtn avatar={letterAvatar}/>
          // ),
          // headerTitle: "",
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
    ...Platform.select({
      android: {
        paddingTop: 25, 
      },
    }),
  },
  scrollInnerContainer: {
    flex: 1,
    padding: SIZES.medium
  }
});

export default Home;