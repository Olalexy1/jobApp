import { Text, View, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Input, Icon } from '@rneui/themed';
import { AuthStore, appSignIn } from "../../firebase";
import { COLORS, FONT, SIZES } from "../../constants";

export default function Login() {
  // const { signIn } = useAuth();
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: '100%' }}>

      <Image
        style={styles.logo}
        source={require('../../assets/images/logo.png')}
      />
      <View style={styles.innerContainers}>
        <Input
          placeholder="Enter Email"
          autoCapitalize="none"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
          }}
          style={styles.textInput}
          leftIcon={
            < Icon
              name='user'
              solid
              type="font-awesome-5"
              color={COLORS.primary}
            />
          }
        />
      </View>


      <View style={styles.innerContainers}>
        <Input
          placeholder="Enter Password"
          secureTextEntry={show ? false : true}
          nativeID="password"
          onChangeText={(text) => {
            passwordRef.current = text;
          }}
          style={styles.textInput}
          leftIcon={
            < Icon
              name='lock'
              solid
              type="font-awesome-5"
              color={COLORS.primary}
            />
          }
          rightIcon={
            < Icon
              name={show ? 'eye' : 'eye-slash'}
              type="font-awesome-5"
              size={24}
              color={COLORS.primary}
              onPress={handleClick}
            />
          }
        />
      </View>
      <TouchableOpacity style={styles.loginBtn}
        onPress={async () => {
          const resp = await appSignIn(emailRef.current, passwordRef.current);
          if (resp?.user) {
            router.replace("/");
          } else {
            console.log(resp?.error)
          }
        }}
      >
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>
      <Text style={{ color: COLORS.secondary, fontWeight: '600' }}>
        Don't have an Account?
        <Text
          style={{ color: '#407BFF' }}
          onPress={() => {
            router.push("/create-account");
          }}
        > Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainers: {
    width: '85%',
  },
  label: {
    marginBottom: 4,
    color: "#407BFF",
    fontWeight: "600"
  },
  textInput: {
    paddingHorizontal: 8,
    // paddingVertical: 10,
    marginBottom: 8,
  },
  loginBtn: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#407BFF",
    width: '80%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
  },
  loginBtnText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
  logo: {
    width: 160,
    height: 160,
  },
});