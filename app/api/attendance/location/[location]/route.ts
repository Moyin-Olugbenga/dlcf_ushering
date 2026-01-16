import { database } from "@/config/db";
import { LOCATION } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest, context: { params: Promise<{ location: string }> }
) => {
    const { month } = await req.json();
        const {location} = await context.params; 
        console.log("Location param:", location);
    if (!month || !location) {
      return NextResponse.json({ error: "Month required" }, { status: 400 });
    }

    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try{
    const locationParam = location.toUpperCase() as keyof typeof LOCATION;
        console.log("Location param:", locationParam);

    if (!(locationParam in LOCATION)) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const locationValue = LOCATION[locationParam];
        console.log("Location Value:", locationValue);

        const records = await database.attendance.findMany({
            where:{
                location: locationValue,
                attendanceDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            include: {
                breakdowns: true,
            },
            orderBy: {
                attendanceDate: 'asc',
            },
        });

        return NextResponse.json({ message: "Attendance gotten Successfully.", data: records }, { status: 200 })

        }catch(error){
            console.error(error);
            throw new Error("An error occurred while fetching Attendance.");
        }
    }



