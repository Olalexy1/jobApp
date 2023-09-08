import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}

// import { useRootNavigationState } from "expo-router";
// import { useRouter, useSegments } from "expo-router";
// import { AuthStore } from "../firebase";
// import React, { useState } from "react";
// import { ActivityIndicator, Text, View } from "react-native";

// const { initialized, isLoggedIn, user } = AuthStore.useState();

// const Index = (user: any) => {

//   const segments = useSegments();
//   const router = useRouter();

//   const navigationState = useRootNavigationState();

//   console.log(isLoggedIn, 'isLoggedIn')

//   React.useEffect(() => {
//     if (!navigationState?.key || !initialized) return;

//     const inAuthGroup = segments[0] === "(auth)";

//     if (
//       // If the user is not signed in and the initial segment is not anything
//       //  segment is not anything in the auth group.
//       !user &&
//       !inAuthGroup
//     ) {
//       // Redirect to the login page.
//       router.replace("/login");
//     } else if (user && inAuthGroup) {
//       // go to tabs root.
//       router.replace("/(tabs)/home");
//     }
//   }, [user, segments]);

//   // return <View>{!navigationState?.key ?  <ActivityIndicator size='large' color={COLORS.primary} /> : <></>}</View>;
// };
// export default Index
