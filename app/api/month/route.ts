// app/api/attendance/month/route.ts
import { NextResponse } from "next/server";
import { database } from "@/config/db";
import { AttendanceType } from "@/lib/generated/prisma";

export async function POST(req: Request) {
  try {
    const { month } = await req.json(); // e.g. "2025-07"

    if (!month) {
      return NextResponse.json({ error: "Month required" }, { status: 400 });
    }

    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch data for the given month with breakdowns
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
    });

    // Organize data into { location -> type -> male/female totals }
    const locationSummary: Record<string, any> = {};

    attendances.forEach((att) => {
      const loc = att.location;
      if (!locationSummary[loc]) {
        locationSummary[loc] = {
          NONSTUDENT_MALE: 0,
          NONSTUDENT_FEMALE: 0,
          STUDENT_MALE: 0,
          STUDENT_FEMALE: 0,
          YOUTH_MALE: 0,
          YOUTH_FEMALE: 0,
          CHILDREN_MALE: 0,
          CHILDREN_FEMALE: 0,
          GUEST_MALE: 0,
          GUEST_FEMALE: 0,
          NEWCOMER_MALE: 0,
          NEWCOMER_FEMALE: 0,
          CONVERT_MALE: 0,
          CONVERT_FEMALE: 0,
          TOTAL: 0,
        };
      }

      att.breakdowns.forEach((b) => {
        if (b.type === AttendanceType.STUDENT) {
          locationSummary[loc].STUDENT_MALE += b.male;
          locationSummary[loc].STUDENT_FEMALE += b.female;
        }
        if (b.type === AttendanceType.YOUTH) {
          locationSummary[loc].YOUTH_MALE += b.male;
          locationSummary[loc].YOUTH_FEMALE += b.female;
        }
        if (b.type === AttendanceType.CHILDREN) {
          locationSummary[loc].CHILDREN_MALE += b.male;
          locationSummary[loc].CHILDREN_FEMALE += b.female;
        }
        if (b.type === AttendanceType.NON_STUDENT) {
          locationSummary[loc].NONSTUDENT_MALE += b.male;
          locationSummary[loc].NONSTUDENT_FEMALE += b.female;
        }
        if (b.type === AttendanceType.GUEST) {
          locationSummary[loc].GUEST_MALE += b.male;
          locationSummary[loc].GUEST_FEMALE += b.female;
        }
        if (b.type === AttendanceType.NEWCOMER) {
          locationSummary[loc].NEWCOMER_MALE += b.male;
          locationSummary[loc].NEWCOMER_FEMALE += b.female;
        }
        if (b.type === AttendanceType.CONVERT) {
          locationSummary[loc].CONVERT_MALE += b.male;
          locationSummary[loc].CONVERT_FEMALE += b.female;
        }
      });

      locationSummary[loc].TOTAL += att.total;
    });

    return NextResponse.json({
      month,
      data: locationSummary,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
