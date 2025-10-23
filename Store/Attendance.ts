"use client";
import { TUser } from "@/app/types/user";
import { Store } from "pullstate";
import axios from "axios";
import { AttendanceRecord, InitialAttendanceRecord } from "@/app/types/attendance";

interface AttendanceStore {
    data: AttendanceRecord;
    fetchingAttendance: boolean;
}


const initialAttendanceStoreState : AttendanceStore = {
    data: InitialAttendanceRecord,
    fetchingAttendance: false
}

const attendanceStore = new Store<AttendanceStore>(initialAttendanceStoreState);
export const useAttendance = () => {
    return attendanceStore.useState();
}

const updateAttendance = <K extends keyof AttendanceStore>(key: K, value: AttendanceStore[K]) => {
    attendanceStore.update(store => {
        return {
            ...store,
            [key] : value
        }
    })
}

const fetchAttendanceData = async (attendanceId: string) : Promise<TUser> => {
    updateAttendance("fetchingAttendance", true);
    try {
        const { data } = await axios.get(`/api/attendance/${attendanceId}`);
        console.log("Store:data.attendance", data.attendance);
        updateAttendance("data", data.attendance);
        return data.attendance;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching user data:", error.response?.data);
        } else {
            console.error("Unexpected error fetching user data:", error);
        }
        throw error;
    } finally {
        updateAttendance("fetchingAttendance", false);
    }
}


export const AttendanceStore = {
    updateAttendance,
    fetchAttendanceData
}