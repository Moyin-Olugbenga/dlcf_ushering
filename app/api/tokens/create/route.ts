
import { database } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    try{
        const {token, random_password, hash} = await req.json();

        const tokens = await database.admin.create({
            data:{
                username: token,
                pass: random_password,
                password: hash
            },
            select: {
                uuid: true,
                username: true,
                pass: true,
                createdAt: true,

            }
        });
        
        return NextResponse.json({ message: "Tokens created Successfully.", data: tokens }, { status: 200 })

        }catch(error){
            console.error(error);
            throw new Error("An error occurred while creating bin.");
        }
    }