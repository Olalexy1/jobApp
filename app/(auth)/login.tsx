import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Input, Icon } from '@rneui/themed';
import { AuthStore, appSignIn } from "../../firebase";
import { COLORS, FONT, SIZES } from "../../constants";
import { validateEmail } from "../../utils";
import { useToast, VStack, HStack, Center, IconButton, CloseIcon, Alert } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

interface FormData {
  email: string;
  password: string;
}

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

export default function Login() {
  // const { signIn } = useAuth();
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });

  const [spinner, setSpinner] = useState(false);

  const { email, password } = formData;

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleChangeInput = (name: string, e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const value = e.nativeEvent.text;
    setFormData({ ...formData, [name]: value });
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const ToastAlert: React.FC<ToastItem & { id: string, status?: string, duration: number }> = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    duration,
    ...rest
  }) => (
    <Alert
      maxWidth="90%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : "info"}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text style={styles.alertTitleText}>
              {title}
            </Text>
          </HStack>
          {isClosable ? (
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size="3" />}
              _icon={{
                color: variant === "solid" ? "lightText" : "darkText"
              }}
              onPress={() => toast.close(id)}
            />
          ) : null}
        </HStack>
        <Text style={styles.alertTitleText}>
          {description}
        </Text>
      </VStack>
    </Alert>
  );

  const validateInputs = () => {
    let validationPassed = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      validationPassed = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
      validationPassed = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      validationPassed = false;
    }

    setErrors(newErrors);
    return validationPassed;
  };

  const handleSubmit = async () => {
    setSpinner(true)
    if (validateInputs()) {
      const resp = await appSignIn(formData.email, formData.password);
      setSpinner(false)
      if (resp?.user) {
        router.replace("/");
      } else {
        console.log(resp?.error)
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Incorrect Credentials!"} variant={"solid"} description={"Please enter correct password and email."} duration={10000} status={"error"} isClosable={true} />;
          }
        })
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: '100%' }}>
          <Spinner
            visible={spinner}
          />
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
              onChange={(value) => handleChangeInput('email', value)}
              style={styles.textInput}
              leftIcon={
                < Icon
                  name='user'
                  solid
                  type="font-awesome-5"
                  color={COLORS.primary}
                />
              }
              errorMessage={errors.email}
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
              onChange={(value) => handleChangeInput('password', value)}
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
              errorMessage={errors.password}
            />
          </View>
          <TouchableOpacity style={styles.loginBtn}
            onPress={handleSubmit}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  alertTitleText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
});