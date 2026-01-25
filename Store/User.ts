"use client";
import { TUser } from "@/app/types/user";
import { Store } from "pullstate";
import { LOCATION, UserType } from "@/lib/generated/prisma";
import axios from "axios";

interface UserStore {
    data: TUser;
    fetchingUser: boolean;
}
interface UsersStore {
    data: TUser[];
    fetchingUsers: boolean;
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

const initialUsersStoreState : UsersStore = {
    data: [initTUser],
    fetchingUsers: false
}

const userStore = new Store<UserStore>(initialUserStoreState);
export const useUser = () => {
    return userStore.useState();
}

const usersStore = new Store<UsersStore>(initialUsersStoreState);
export const useUsers = () => {
    return usersStore.useState();
}


const updateUser = <K extends keyof UserStore>(key: K, value: UserStore[K]) => {
    userStore.update(store => {
        store[key] = value;
    })
}

const updateUsers = <K extends keyof UsersStore>(key: K, value: UsersStore[K]) => {
    usersStore.update(store => {
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
    // console.log("Store after update:", userStore.getRawState()); // Check store state
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

const fetchUsers = async () : Promise<TUser[]> => {
    updateUsers("fetchingUsers", true);
    try {
        const { data } = await axios.get("/api/users");
        // console.log("Store:data.user", data.user);
        updateUsers("data", data.user);
        return data.user;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching user data:", error.response?.data);
        } else {
            console.error("Unexpected error fetching user data:", error);
        }
        throw error;
    } finally {
        updateUsers("fetchingUsers", false);
    }
}

// const fetchUsers = async () : Promise<TUser[]> => {
//   updateUsers("fetchingUsers", true);
//   try {
//     const { data } = await axios.get("/api/users");
//     updateUsers("data", data.users); // Changed from data.user to data.users
//     return data.users; // Also changed here
//   } catch (error: unknown) {
//     // ... error handling
//   } finally {
//     updateUsers("fetchingUsers", false);
//   }
// }

export const UserStore = {
    updateUser,
    fetchUserData,
    updateUsers,
    fetchUsers
}