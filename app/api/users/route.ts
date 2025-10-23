import { database } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";


const GetUser = async(req: NextRequest) => {
    try{
        const user = await database.user.findMany({
            omit: {
                password: true,
                createdAt: true,
                updatedAt: true,
                id: true,
            }
        })
        

        return NextResponse.json({user, message: "User retrieved succesfully."}, {status: 200});
        
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "An error occurred while fetching the user."}, {status: 500});
    }
}

export {GetUser as GET}