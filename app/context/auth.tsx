import { useRootNavigation, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
  getAuth
} from "firebase/auth";
import { app, auth } from "../../firebaseConfig";

// Define the AuthContextValue interface
interface SignInResponse {
  data: User | null;
  error: Error | null;
}

interface SignOutResponse {
  error: any | null;
  data: {} | null;
}

interface AuthContextValue {
  signIn: (e: string, p: string) => Promise<SignInResponse>;
  signUp: (e: string, p: string, n: string) => Promise<SignInResponse>;
  signOut: () => Promise<SignOutResponse>;
  user: User | null;
  authInitialized: boolean;
}

// Define the Provider component
interface ProviderProps {
  children: React.ReactNode;
}

// Create the AuthContext
const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function Provider(props: ProviderProps) {
  const [user, setAuth] =
    React.useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);

  // This hook will protect the route access based on user authentication.
  const useProtectedRoute = (user: User | null) => {
    const segments = useSegments();
    const router = useRouter();

    // checking that navigation is all good;
    const [isNavigationReady, setNavigationReady] = useState(false);
    const rootNavigation = useRootNavigation();

    useEffect(() => {
      const unsubscribe = rootNavigation?.addListener("state", (event) => {
        setNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rootNavigation]);

    React.useEffect(() => {
      if (!isNavigationReady) {
        return;
      }

      const inAuthGroup = segments[0] === "(auth)";

      if (!authInitialized) return;

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.push("/login");
      } else if (user && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.push("/");
      }
    }, [user, segments, authInitialized, isNavigationReady]);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setAuth(user);
        // ...
      } else {
        // User is signed out
        setAuth(null);
      }
    });
  }, [user]); //Check here

  const appSignOut = async (): Promise<SignOutResponse> => {
    try {
      await signOut(auth);
      return { data: null, error: null };
    } catch (e) {
      return { data: null,  error: e };
    } finally {
      setAuth(null)
    }
  };

  const appSignIn = async (email: string, password: string): Promise<SignInResponse> => {
    try {
      const resp: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      setAuth(auth.currentUser)
      return { data: auth.currentUser, error: null };
    } catch (e) {
      setAuth(null)
      return { data: null, error: e as Error};
    }
  };

  const appSignUp = async (email: string, password: string, displayName: any): Promise<SignInResponse> => {
    try {
      // this will trigger onAuthStateChange to update the store..
      const resp = await createUserWithEmailAndPassword(auth, email, password);

      // add the displayName
      await updateProfile(resp.user, { displayName });

      setAuth(auth.currentUser);

      return { data: auth.currentUser, error: null };
    } catch (e) {
      setAuth(null);
      return { data: null, error: e  as Error};
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: appSignIn,
        signOut: appSignOut,
        signUp: appSignUp,
        user,
        authInitialized,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Define the useAuth hook
export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return authContext;
};