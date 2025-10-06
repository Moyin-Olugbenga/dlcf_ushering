
import { NextResponse } from "next/server";
import axios from "axios";
import { LOCATION, Prisma, SERVICE } from "@/lib/generated/prisma";

const llink = process.env.NEXT_PUBLIC_API_LINK as string;

// export type AttendanceEesult = Prisma.AttendanceGetPayload<{
//     select: {
//         id: true,
//         uuid: true,
//         username: true,
//         pass: true,
//     }
// }>


export class Attendance {

    public static async getAllAtteendance() : Promise<any> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendancesByLocation(location: LOCATION) : Promise<any> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/location/${location}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendanceByLocationAndServices(location: LOCATION, service: SERVICE) : Promise<any> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/location/${location}/service/${service}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendanceByService(service: SERVICE) : Promise<any> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/service/${service}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendanceByServiceDate(serviceDate: string) : Promise<any> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/serviceDate/${serviceDate}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getMonthlyAttendance() : Promise<any> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/monthly`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }
    private static async generateToken(n: number) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var token = '';
        for(var i = 0; i < n; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
        
    
}