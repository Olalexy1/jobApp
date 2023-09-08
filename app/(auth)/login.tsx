import { Text, View, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
// import { AuthStore, appSignIn } from "../../firebase";
import { Stack, useRouter } from "expo-router";
import { useRef } from "react";
import { useAuth } from "../context/auth";

export default function LogIn() {
  const { signIn } = useAuth();
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email"
          autoCapitalize="none"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
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
          onPress={async () => {
            const { data, error } = await signIn(emailRef.current, passwordRef.current);
            if (data) {
              router.replace("/");
            } else {
              console.log(error)
            }
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <Text
        onPress={() => {
          router.push("/create-account");
        }}
      >
        Create Account
      </Text>
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