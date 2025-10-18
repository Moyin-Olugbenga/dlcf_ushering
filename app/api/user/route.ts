import { Auth } from "@/classes/Auth.class";
import { UNextRequest } from "@/app/types/request";
import { NextResponse } from "next/server";

export const GET = async(req: UNextRequest) => {
    try{
        await Auth.verifyToken(req);
        
        return NextResponse.json(
            {
                user:req.user, 
                message: "User retrieved succesfully."
            }, 
            {
                status: 200
            }
        );
        
    }catch(error){
        console.error(error);
        return NextResponse.json({
            error: "An error occurred while fetching the user.",
            status: 500
        })
    }
}