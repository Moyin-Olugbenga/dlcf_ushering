"use server";
import { NextRequest, NextResponse } from "next/server";
import { AttendanceData } from "@/app/types/attendance";
import { AttendanceSchema } from "../../../schemaDefinitions/Attendance";
import { Attendance } from "@/classes/Attendance.class";
import { AttendanceResponse } from "@/app/interfaces/attendance.interface";

export const POST = async(req: NextRequest) => {
    try{
        const dto: AttendanceData = await req.json();
        const isValid = AttendanceSchema.safeParse(dto);

        if (!isValid.success) {
            throw new Error('Invalid input');
        }
        const attendance: AttendanceResponse = await Attendance.createAttendance(dto);
        if(attendance?.error) {
            return NextResponse.json({ error: true, message: attendance?.message ? attendance?.message : "Attendance not created", status: 500 });
        }
        return NextResponse.json({ error: false, data: attendance, status: 200 });

    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Unknown error occurred", status: 500 });
    }
}