import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRef, useState, ChangeEvent } from "react";
// import { useAuth } from "../context/auth";
import { AuthStore, appSignUp } from "../../firebase";
import { Input, Icon } from '@rneui/themed';
import { Stack, useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from "../../constants";
import { useToast, VStack, HStack, Center, IconButton, CloseIcon, Alert } from 'native-base';
import { checkPasswordStrength, validateEmail } from "../../utils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

export default function CreateAccount() {
  // const { signUp } = useAuth();
  const router = useRouter();
  // const emailRef = useRef("");
  // const firstNameRef = useRef("");
  // const lastNameRef = useRef("");
  // const passwordRef = useRef("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [showTwo, setShowTwo] = useState(false);
  const handleClickTwo = () => setShowTwo(!showTwo);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState<FormData>({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const [spinner, setSpinner] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    const newErrors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      validationPassed = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      validationPassed = false;
    }

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
    } else if (checkPasswordStrength(password) === 'Weak') {
      newErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character';
      validationPassed = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Password is required';
      validationPassed = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match. Please double-check';
      validationPassed = false;
    }

    setErrors(newErrors);
    return validationPassed;
  };


  const handleSubmit = async () => {

    if (validateInputs()) {
      setSpinner(true)
      const resp = await appSignUp(
        formData.email,
        formData.password,
        formData.firstName + " " + formData.lastName
      );
      setSpinner(false)
      if (resp?.user) {
        setLoading(true);
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Account Created!"} variant={"solid"} description={"Your Account has been created."} duration={10000} status={"success"} isClosable={true} />;
          }
        })

        router.replace("/");
      } else {
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Error Creating Account!"} variant={"solid"} description={"Please try again, An error occurred."} duration={10000} status={"error"} isClosable={true} />;
          }
        })
      }
    }

    // const resp = await appSignUp(
    //   emailRef.current,
    //   passwordRef.current,
    //   firstNameRef.current + " " + lastNameRef.current
    // );
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}
      enableOnAndroid={true}
      enableAutomaticScroll={(Platform.OS === 'ios')}
      // extraScrollHeight={50} 
      // extraHeight={130}
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Spinner
            visible={spinner}
          />
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
          />
          <View style={styles.innerContainers}>
            <Input
              placeholder="Enter First Name"
              nativeID="firstName"
              // onChangeText={(text) => {
              //   firstNameRef.current = text;
              // }}
              onChange={(value) => handleChangeInput('firstName', value)}
              style={styles.textInput}
              leftIcon={
                < Icon
                  name='user'
                  solid
                  type="font-awesome-5"
                  color={COLORS.primary}
                />
              }
              errorMessage={errors.firstName}
            />
          </View>
          <View style={styles.innerContainers}>
            <Input
              placeholder="Enter Last Name"
              nativeID="lastName"
              // onChangeText={(text) => {
              //   lastNameRef.current = text;
              // }}
              onChange={(value) => handleChangeInput('lastName', value)}
              style={styles.textInput}
              leftIcon={
                < Icon
                  name='user'
                  solid
                  type="font-awesome-5"
                  color={COLORS.primary}
                />
              }
              errorMessage={errors.lastName}
            />
          </View>
          <View style={styles.innerContainers}>
            <Input
              placeholder="Enter Email"
              autoCapitalize="none"
              nativeID="email"
              keyboardType="email-address"
              // onChangeText={(text) => {
              //   emailRef.current = text;
              // }}
              onChange={(value) => handleChangeInput('email', value)}
              style={styles.textInput}
              leftIcon={
                < Icon
                  name='envelope'
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
              // onChangeText={(text) => {
              //   passwordRef.current = text;
              // }}
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

          <View style={styles.innerContainers}>
            <Input
              placeholder="Confirm Password"
              secureTextEntry={showTwo ? false : true}
              nativeID="confirmPassword"
              // onChangeText={(text) => {
              //   passwordRef.current = text;
              // }}
              onChange={(value) => handleChangeInput('confirmPassword', value)}
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
                  name={showTwo ? 'eye' : 'eye-slash'}
                  type="font-awesome-5"
                  size={24}
                  color={COLORS.primary}
                  onPress={handleClickTwo}
                />
              }
              errorMessage={errors.confirmPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.signBtn}
            onPress={handleSubmit}
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
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // borderWidth: 3,
    // borderColor: 'red',
  },
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
  alertTitleText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
});
