import { database } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

interface ContextParams {
    userId: string;
}

const GetUser = async(req: NextRequest, context: { params: Promise<ContextParams> }) => {
    try{
        const {userId} = await context.params;

        const user = await database.user.findUnique({
            where: {
                uuid: userId
            },
            omit: {
                password: true
            }
        })

        return NextResponse.json({user, message: "User retrieved succesfully."}, {status: 200});
        
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "An error occurred while fetching the user."}, {status: 500});
    }
}

export {GetUser as GET}