import { NextResponse } from "next/server";
import { database } from "@/config/db";
import { AttendanceType } from "@/lib/generated/prisma";

export async function GET() {
  try {
    const data = await database.attendance.findMany({
      include: {
        breakdowns: true,
      },
      
    });

    const monthly: Record<
      string,
      {
        totalAttendance: number;
        totalMale: number;
        totalFemale: number;
        newMembers: number;
        locations: Set<string>;
      }
    > = {};

    data.forEach((record) => {
      const date = new Date(record.attendanceDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthly[monthKey]) {
        monthly[monthKey] = {
          totalAttendance: 0,
          totalMale: 0,
          totalFemale: 0,
          newMembers: 0,
          locations: new Set(),
        };
      }

      // Add totals from Attendance
      monthly[monthKey].totalAttendance += record.total;
      monthly[monthKey].totalMale += record.totalMale;
      monthly[monthKey].totalFemale += record.totalFemale;
      monthly[monthKey].locations.add(record.location);

      // If breakdowns include "NewComers" type, count them
      record.breakdowns.forEach((b) => {
        if (b.type === AttendanceType.NEWCOMER) {
          monthly[monthKey].newMembers += b.male + b.female;
        }
      });
    });

    // Format result into array
    const result = Object.entries(monthly)
      .map(([month, stats]) => ({
        month,
        totalAttendance: stats.totalAttendance,
        totalMale: stats.totalMale,
        totalFemale: stats.totalFemale,
        newMembers: stats.newMembers,
        activeLocations: stats.locations.size,
      }))
      .sort((a, b) => (a.month > b.month ? 1 : -1));

    // Add growth percentage (MoM)
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1].totalAttendance;
      const curr = result[i].totalAttendance;
      result[i].growth =
        prev > 0 ? (((curr - prev) / prev) * 100).toFixed(2) + "%" : "N/A";
    }
    if (result.length > 0) {
      result[0].growth = "N/A";
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly attendance" },
      { status: 500 }
    );
  }
}
