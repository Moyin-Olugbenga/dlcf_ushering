
import { NextResponse } from "next/server";
import axios from "axios";
import { AttendanceType, LOCATION, SERVICE } from "@/lib/generated/prisma";
import { AttendanceData } from "@/app/types/attendance";
// import { Attendance as TAttendance } from "@/lib/generated/prisma";
import { database } from "@/config/db";
import { AttendanceResponse } from "@/app/interfaces/attendance.interface";

const llink = process.env.NEXT_PUBLIC_API_LINK as string;



export class Attendance {
    public static async createAttendance(data: AttendanceData) : Promise<AttendanceResponse> {
        const totalMale = data.chMale + data.nsMale + data.sMale + data.yMale;
        const totalFemale = data.chFemale + data.nsFemale + data.sFemale + data.yFemale;
        const attendanceDate = new Date(data.serviceDate);

        const SERVICE_DAYS: Record<SERVICE, string> = {
            [SERVICE.MBS]: "Monday",
            [SERVICE.SWS]: "Sunday",
            [SERVICE.TRH]: "Thursday",
            [SERVICE.SWM]: "Saturday",
            [SERVICE.GCK_DAY1]: "Thursday",
            [SERVICE.GCK_DAY2]: "Friday",
            [SERVICE.IMPACT]: "Saturday",
            [SERVICE.GCK_DAY3]: "Saturday",
            [SERVICE.GCK_DAY4]: "Sunday",
            [SERVICE.GCK_DAY5]: "Monday",
            [SERVICE.GCK_DAY6]: "Tuesday",
        };
        const getDayName = (dateString: string): string => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(dateString);
        return days[date.getDay()];
        };
        const validateServiceDate = (service: SERVICE, dateString: string): boolean => {
            const dayFromDate = getDayName(dateString);
            const expectedDay = SERVICE_DAYS[service];
            return dayFromDate === expectedDay;
        };
        
        const attendanceExists = await database.attendance.findFirst({
            where: {
                location: data.location,
                service: data.service,
                attendanceDate: new Date(data.serviceDate),
            }
        });
        if (attendanceExists) {
            const response: AttendanceResponse =  {error: true, message: "Attendance for this location, service and date already exists"};
            return response;
        }
        const isValid = validateServiceDate(data.service, attendanceDate.toISOString());

        if (!isValid) {
            const response: AttendanceResponse =  {error: true, message: "The selected date does not match the expected service day!"};
            return response;
        }
        try {
            const attendance = await database.attendance.create({
                data: {
                    recordedById: data.recordedById,
                    location: data.location,
                    service: data.service,
                    totalMale: totalMale,
                    totalFemale: totalFemale,
                    total: totalMale + totalFemale,
                    attendanceDate: new Date(data.serviceDate),
                    breakdowns: {
                        create: [
                            {
                                type: AttendanceType.STUDENT,
                                male: data.sMale,
                                female: data.sFemale,
                            },
                            {
                                type: AttendanceType.NON_STUDENT,
                                male: data.nsMale,
                                female: data.nsFemale,
                            },
                            {
                                type: AttendanceType.CHILDREN,
                                male: data.chMale,
                                female: data.chFemale,
                            },
                            {
                                type: AttendanceType.YOUTH,
                                male: data.yMale,
                                female: data.yFemale,
                            },
                            {
                                type: AttendanceType.CONVERT,
                                male: data.conMale,
                                female: data.conFemale,
                            },
                            {
                                type: AttendanceType.NEWCOMER,
                                male: data.ncMale,
                                female: data.ncFemale,
                            },
                            {
                                type: AttendanceType.GUEST,
                                male: data.gMale,
                                female: data.gFemale,
                            },
                        ],
                    },
                },
            });
            if(!attendance) {
                const response: AttendanceResponse =  {error: true, message: "Attendance not created"};
                return response;
            }
            const response: AttendanceResponse =  {error: false, message: "Attendance created successfully", data: attendance.uuid};
            return response;
        } catch (error) {
            console.error(error);
            const response: AttendanceResponse =  {error: true, message: "Failed to create attendance"};
            return response;
        }
    }

    public static async getAllAttendance() : Promise<unknown> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendancesByLocation(location: LOCATION) : Promise<unknown> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/location/${location}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendanceByLocationAndServices(location: LOCATION, service: SERVICE) : Promise<unknown> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/location/${location}/service/${service}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendanceByService(service: SERVICE) : Promise<unknown> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/service/${service}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getAttendanceByServiceDate(serviceDate: string) : Promise<unknown> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/serviceDate/${serviceDate}`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }

    public static async getMonthlyAttendance() : Promise<unknown> {
        try {
             const {data} =  await axios.get(`${llink}/api/attendance/monthly`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching attendance.", status: 500});
 
        }
    }
    private static async generateToken(n: number) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = '';
        for(let i = 0; i < n; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
        
    
}