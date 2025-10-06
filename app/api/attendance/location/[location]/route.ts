
import { database } from "@/config/db";
import { LOCATION } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest, context: { params: Promise<{ location: LOCATION }> }
) => {
    const { month } = await req.json(); // e.g. "2025-07"

    if (!month || !location) {
      return NextResponse.json({ error: "Month required" }, { status: 400 });
    }

    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try{
        const {location} = await context.params;
        const records = await database.attendance.findMany({
            where:{
                location: location,
                attendanceDate: {
                gte: startDate,
                lt: endDate,
            },
            },
            select: {
                breakdowns: true,
            }
        });

        const summary: Record<string, any> = {};

  for (const record of records) {
    const service = record.service;
    const dateStr = record.attendanceDate.toISOString().split("T")[0]; // "2025-10-26"
    const key = `${service} (${dateStr})`;
    if (!summary[service]) {
      summary[service] = {
        NONSTUDENT_MALE: 0, NONSTUDENT_FEMALE: 0,
        STUDENT_MALE: 0, STUDENT_FEMALE: 0,
        YOUTH_MALE: 0, YOUTH_FEMALE: 0,
        CHILDREN_MALE: 0, CHILDREN_FEMALE: 0,
        GUEST_MALE: 0, GUEST_FEMALE: 0,
        NEWCOMER_MALE: 0, NEWCOMER_FEMALE: 0,
        CONVERT_MALE: 0, CONVERT_FEMALE: 0,
        TOTAL: record.total,
      };
    }

    for (const b of record.breakdowns) {
    const keyMale = `${b.type}_MALE`;
    const keyFemale = `${b.type}_FEMALE`;
    summary[key][keyMale] = b.male;
    summary[key][keyFemale] = b.female;
    }
  }

        return NextResponse.json({ message: "Attendance gotten Successfully.", data: summary }, { status: 200 })

        }catch(error){
            console.error(error);
            throw new Error("An error occurred while fetching Attendance.");
        }
    }



