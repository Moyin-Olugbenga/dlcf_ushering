import { database } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

interface ContextParams {
    id: string;
}

const DeleteAttendance = async(req: NextRequest, context: { params: Promise<ContextParams> }) => {
    try{
        const {id} = await context.params;

        const deleteAttendance = await database.attendance.delete({
            where: {
                uuid: id
            },
        })
        if(!deleteAttendance){
            return NextResponse.json({error:true, message: "Attendance not found."}, {status: 404});
        }

        return NextResponse.json({error:false, message: "Attendance deleted successfully."}, {status: 200});

    }catch(error){
        console.error(error);
        return NextResponse.json({error:true, message: "An error occurred while fetching the Attendance."}, {status: 500});
    }
}

export {DeleteAttendance as DELETE}