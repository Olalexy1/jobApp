import { Alert, Button, StyleSheet, BackHandler } from 'react-native';
import { Redirect, Stack, useRouter, useNavigation } from "expo-router";
import { Text, View } from '../../../components/Themed';
import { useAuth } from "../../context/auth";
import { AuthStore, appSignOut } from "../../../firebase";
import { Touchable } from 'react-native';
import { useEffect } from 'react';

export default function Settings() {
  // const { user, signOut } = useAuth()
  const router = useRouter();

  // Navigation
  const navigation = useNavigation();

  // Effect
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      Alert.alert("Cannot go back from here. Sign in again")
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
      <Text style={styles.title}>Settings Page</Text>
      {/* <Text style={styles.title}>
        {user?.displayName}
      </Text>
      <Text style={styles.title}>
        {user?.email}
      </Text> */}
      <Text style={styles.title}>
        {AuthStore.getRawState().user?.email}
      </Text>
      <Text style={styles.title}>
        {AuthStore.getRawState().user?.displayName}
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Button
        onPress={async () => {
          const resp = await appSignOut();
          if (!resp?.error) {
            router.replace("/(auth)/login");
          } else {
            console.log(resp.error);
            Alert.alert("Logout Error", resp.error?.message);
          }
        }}
        title="LOGOUT"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
