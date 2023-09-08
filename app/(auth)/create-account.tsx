import { Text, View, TextInput, StyleSheet, Alert } from "react-native";
import { useRef } from "react";
import { useAuth } from "../context/auth";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function CreateAccount() {
  const { signUp } = useAuth();
  const router = useRouter();
  const emailRef = useRef("");
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const passwordRef = useRef("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{ title: "Create Account", headerLeft: () => <></> }}
      />
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          placeholder="firstName"
          nativeID="firstName"
          onChangeText={(text) => {
            firstNameRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          placeholder="lastName"
          nativeID="lastName"
          onChangeText={(text) => {
            lastNameRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          nativeID="password"
          onChangeText={(text) => {
            passwordRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>

      <TouchableOpacity>
        <Text
          style={{ marginBottom: 8 }}
          onPress={async () => {
            const { data, error } = await signUp(
              emailRef.current,
              passwordRef.current,
              firstNameRef.current + " " + lastNameRef.current
            );
            if (data) {
              router.replace("/");
            } else {
              console.log(error);
            }
          }}
        >
          SAVE NEW USER
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 32 }}>
        <Text
          style={{ fontWeight: "500" }}
          onPress={() => router.replace("/login")}
        >
          Click Here To Return To Sign In Page
        </Text>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: "#455fff",
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#455fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
});
