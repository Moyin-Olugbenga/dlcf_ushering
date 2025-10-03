
import { database } from "@/config/db";
import { NextResponse } from "next/server";

export const GET = async() => {
    try{
        const tokens = await database.admin.findMany({
            select: {
                id: true,
                username: true,
                pass: true,
            }
        });

        
        // return tokens;
        
        return NextResponse.json({ message: "Tokens gotten Successfully.", data: tokens }, { status: 200 })

        }catch(error){
            console.error(error);
            throw new Error("An error occurred while fetching notifications.");
        }
    }