// app/api/attendance/month/route.ts
import { NextResponse } from "next/server";
import { database } from "@/config/db";

export async function POST(req: Request) {
  try {
    const { month } = await req.json(); // e.g. "2025-07"

    if (!month) {
      return NextResponse.json({ error: "Month required" }, { status: 400 });
    }

    // Define date boundaries for the month
    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // 1. Fetch ALL records for the month.
    // We include breakdowns and service type so we can group them on the frontend.
    const attendances = await database.attendance.findMany({
      where: {
        attendanceDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        breakdowns: true,
      },
      orderBy: {
        attendanceDate: "asc",
      },
    });

    // 2. Return the array directly. 
    // Do NOT aggregate by location here, because we need to see 
    // individual services for the dropdowns to work.
    return NextResponse.json({
      month,
      data: attendances, 
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}