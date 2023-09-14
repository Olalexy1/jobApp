import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthStore } from "../../../firebase";
import styles from "./welcome.style";
import { icons, SIZES, COLORS } from "../../../constants";
import AvatarBtn from "../../common/avatar/avatar";
import { avatarLetters } from "../../../utils";

const jobTypes = ["Full-time", "Part-time", "Contractor", "Intern"];

interface WelcomeProps {
  searchTerm: string;
  setSearchTerm: any;
  handleClick: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();
  const [activeJobType, setActiveJobType] = useState("Full-time");
  const avatar = AuthStore.getRawState().user?.displayName?.toString()
  const letterAvatar = avatarLetters(avatar)

  return (
    <View>
      <View style={styles.container}>
        <View>
          <Text style={styles.userName}>Hello {AuthStore.getRawState().user?.displayName}</Text>
          <Text style={styles.welcomeMessage}>Find your perfect job</Text>
        </View>
        <AvatarBtn avatar={letterAvatar} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            placeholder='What are you looking for?'
            placeholderTextColor={COLORS.secondary}
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleClick}>
          <Image
            source={icons.search}
            resizeMode='contain'
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          data={jobTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeJobType, item)}
              onPress={() => {
                setActiveJobType(item);
                router.push(`/home/search/${item}`);
              }}
            >
              <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Welcome;