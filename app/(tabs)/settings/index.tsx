import { Alert, Button, StyleSheet, BackHandler, View, Text, TouchableOpacity } from 'react-native';
import { Redirect, Stack, useRouter, useNavigation } from "expo-router";
// import { Text, View } from '../../../components/Themed';
import { useAuth } from "../../context/auth";
import { AuthStore, appSignOut } from "../../../firebase";
import { COLORS, FONT, SIZES } from "../../../constants";
import { useEffect } from 'react';
import { Icon } from '@rneui/themed';


export default function Settings() {
  // const { user, signOut } = useAuth()
  const router = useRouter();
  const navigation = useNavigation();


  // Effect
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      // Alert.alert("Cannot go back from here. Sign in again")
      navigation.dispatch(e.data.action);
    });
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      BackHandler.exitApp();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []); // Empty dependency array means this effect runs once

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <View style={{ width: '80%' }}>
        <Text style={styles.title}>Profile Information:</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          < Icon
            name='user'
            solid
            type="font-awesome-5"
            color={COLORS.primary}
          />
          <Text style={styles.subText}> &nbsp;
            {AuthStore.getRawState().user?.displayName}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          < Icon
            name='envelope'
            solid
            type="font-awesome-5"
            color={COLORS.primary}
          />
          <Text style={styles.subText}> &nbsp;
            {AuthStore.getRawState().user?.email}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          const resp = await appSignOut();
          if (!resp?.error) {
            router.replace("/(auth)/login");
          } else {
            // console.log(resp.error);
          }
        }}
      >
        <Text style={styles.logoutBtnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 20,
    fontWeight: '500',
  },
  logoutBtn: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#407BFF",
    width: '80%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
  },
  logoutBtnText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
});
