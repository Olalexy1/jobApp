import { Store, registerInDevtools } from "pullstate";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    UserCredential
} from "firebase/auth";
import { app, auth } from "./firebaseConfig";
import { Dispatch, createContext, useContext } from "react";

interface AuthStoreType {
    isLoggedIn?: boolean;
    initialized?: boolean;
    user: User | null;
    setUser?: (user: User | null) => void;
}

const AuthContext = createContext<AuthStoreType>({
    user: null,
    setUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

const AuthStore = new Store<AuthStoreType>({
    isLoggedIn: false,
    initialized: false,
    user: null,
});

const unSub = onAuthStateChanged(auth, (user) => {
    // console.log("onAuthStateChange", user);
    AuthStore.update((store) => {
        store.user = user;
        store.isLoggedIn = user ? true : false;
        store.initialized = true;
    });
});

const appSignIn = async (email: string, password: string): Promise<{ user?: User | null; error?: any }> => {
    try {
        const resp: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        AuthStore.update((store) => {
            store.user = resp.user;
            store.isLoggedIn = resp.user ? true : false;
        });
        return { user: auth.currentUser };
    } catch (e) {
        return { error: e };
    }
};

const appSignOut = async (): Promise<{ user?: null; error?: any }> => {
    try {
        await signOut(auth);
        AuthStore.update((store) => {
            store.user = null;
            store.isLoggedIn = false;
        });
        return { user: null };
    } catch (e) {
        return { error: e };
    }
};

const appSignUp = async (email: string, password: string, displayName: any) => {
    try {
        // this will trigger onAuthStateChange to update the store..
        const resp = await createUserWithEmailAndPassword(auth, email, password);

        // add the displayName
        await updateProfile(resp.user, { displayName });

        AuthStore.update((store) => {
            store.user = auth.currentUser;
            store.isLoggedIn = true;
        });

        return { user: auth.currentUser };
    } catch (e) {
        return { error: e };
    }
};

registerInDevtools({ AuthStore });

export {
    AuthStore,
    appSignIn,
    appSignUp,
    appSignOut,
}
