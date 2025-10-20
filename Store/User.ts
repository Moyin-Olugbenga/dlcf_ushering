"use client";
import { TUser } from "@/app/types/user";
import { Store } from "pullstate";
import { LOCATION, UserType } from "@/lib/generated/prisma";
import axios from "axios";

interface UserStore {
    data: TUser;
    fetchingUser: boolean;
}

const initTUser = {
    uuid: "",
    firstName: "",
    lastName: "",
    email: "",
    userType: UserType.USHER,
    location: LOCATION.RELIGION_GROUND
}

const initialUserStoreState : UserStore = {
    data: initTUser,
    fetchingUser: false
}

const userStore = new Store<UserStore>(initialUserStoreState);
export const useUser = () => {
    return userStore.useState();
}

const updateUser = <K extends keyof UserStore>(key: K, value: UserStore[K]) => {
    userStore.update(store => {
        return {
            ...store,
            [key] : value
        }
    })
}

const fetchUserData = async () : Promise<TUser> => {
    updateUser("fetchingUser", true);
    try {
        const { data } = await axios.get("/api/user");
        // console.log("Store:data.user", data.user);
        updateUser("data", data.user);
        return data.user;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching user data:", error.response?.data);
        } else {
            console.error("Unexpected error fetching user data:", error);
        }
        throw error;
    } finally {
        updateUser("fetchingUser", false);
    }
}


export const UserStore = {
    updateUser,
    fetchUserData
}