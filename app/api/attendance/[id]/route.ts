import { database } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

interface ContextParams {
    id: string;
}

const GetAttendance = async(req: NextRequest, context: { params: Promise<ContextParams> }) => {
    try{
        const {id} = await context.params;

        const attendance = await database.attendance.findUnique({
            where: {
                uuid: id
            },
            include: {
                breakdowns: true
            }
        });
        

        return NextResponse.json({attendance, message: "Attendance retrieved succesfully."}, {status: 200});

    }catch(error){
        console.error(error);
        return NextResponse.json({error: "An error occurred while fetching the Attendance."}, {status: 500});
    }
}

export {GetAttendance as GET}