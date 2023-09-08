import { Alert, Button, StyleSheet } from 'react-native';
import { Redirect, Stack, useRouter } from "expo-router";
import { Text, View } from '../../../components/Themed';
import { useAuth } from "../../context/auth";
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import { Touchable } from 'react-native';

export default function Settings() {
  const { user, signOut } = useAuth()
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <Text style={styles.title}>Settings Page</Text>
      <Text style={styles.title}>
        {user?.displayName}
      </Text>
      <Text style={styles.title}>
        {user?.email}
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Button
        onPress={async () => {
          const resp = await signOut();
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
