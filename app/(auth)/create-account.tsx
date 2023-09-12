import { Text, View, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { useRef, useState } from "react";
// import { useAuth } from "../context/auth";
import { AuthStore, appSignUp } from "../../firebase";
import { Input, Icon } from '@rneui/themed';
import { Stack, useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from "../../constants";
import { useToast } from 'native-base';

export default function CreateAccount() {
  // const { signUp } = useAuth();
  const router = useRouter();
  const emailRef = useRef("");
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const passwordRef = useRef("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    const resp = await appSignUp(
      emailRef.current,
      passwordRef.current,
      firstNameRef.current + " " + lastNameRef.current
    );
    if (resp?.user) {
      setLoading(true);
      toast.show({
        title: 'Account Created!',
        description: `Your Account has been created.`,
        variant: 'solid',
        duration: 10000,
        // isClosable: true,
      });
      router.replace("/");
    } else {
      console.log(resp?.user);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <Stack.Screen
        options={{ title: "Create Account", headerLeft: () => <></> }}
      /> */}
      <Image
        style={styles.logo}
        source={require('../../assets/images/logo.png')}
      />
      <View style={styles.innerContainers}>
        <Input
          placeholder="Enter First Name"
          nativeID="firstName"
          onChangeText={(text) => {
            firstNameRef.current = text;
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
          placeholder="Enter Last Name"
          nativeID="lastName"
          onChangeText={(text) => {
            lastNameRef.current = text;
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
          placeholder="Enter Email"
          autoCapitalize="none"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
          }}
          style={styles.textInput}
          leftIcon={
            < Icon
              name='envelope'
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

      <TouchableOpacity
        style={styles.signBtn}
        onPress={async () => {
          const resp = await appSignUp(
            emailRef.current,
            passwordRef.current,
            firstNameRef.current + " " + lastNameRef.current
          );
          if (resp?.user) {
            router.replace("/");
          } else {
            console.log(resp?.user);
          }
        }}
      >
        <Text style={styles.signBtnText}>Create An Account</Text>
      </TouchableOpacity>
      <Text style={{ color: COLORS.secondary, fontWeight: '600' }}>
        Already have an Account?
        <Text
          style={{ color: '#407BFF' }}
          onPress={() => {
            router.push("/login");
          }}
        > Sign In</Text>
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
    color: "#455fff",
  },
  textInput: {
    paddingHorizontal: 8,
    // paddingVertical: 4,
    marginBottom: 8,
  },
  signBtn: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#407BFF",
    width: '80%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
  },
  signBtnText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
  logo: {
    width: 160,
    height: 160,
  },
});
