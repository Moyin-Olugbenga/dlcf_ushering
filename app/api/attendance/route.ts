
import { database } from "@/config/db";
import { NextResponse } from "next/server";

export const GET = async() => {
    try{
        const allAttendance = await database.attendance.findMany({
            select: {
                breakdowns: true,
            }
        });

        return NextResponse.json({ message: "Attendance gotten Successfully.", data: allAttendance,status: 200 })

        }catch(error){
            console.error(error);
            throw new Error("An error occurred while fetching Attendance.");
        }
    }