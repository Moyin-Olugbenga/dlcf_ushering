
import { database } from "@/config/db";
import { LOCATION, SERVICE } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest, context: { params: Promise<{ service: SERVICE }> }
) => {
    try{
    const {service} = await context.params;
        const tokens = await database.attendance.findMany({
            where:{
                service: service
            },
            select: {
                breakdowns: true,
            }
        });

        return NextResponse.json({ message: "Tokens gotten Successfully.", data: tokens }, { status: 200 })

        }catch(error){
            console.error(error);
            throw new Error("An error occurred while fetching notifications.");
        }
    }
