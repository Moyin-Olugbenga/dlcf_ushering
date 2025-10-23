import { TUser } from "@/app/types/user";
import { database } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

const EditUser = async(req: NextRequest ) => {
    try{

        const dto: TUser = await req.json();
        const {uuid, ...data} = dto
        const user = await database.user.update({
            where: {
                uuid,
            },
            data: {
                ...data
            }
        })

        return NextResponse.json({user, message: "User retrieved succesfully."}, {status: 200});
        
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "An error occurred while fetching the user."}, {status: 500});
    }
}

export {EditUser as POST}