import { LOCATION, SERVICE, UserType } from "@/lib/generated/prisma";

export type ServiceAttendance = {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
    location: LOCATION;
}


export type Breakdown = {
  id: number;
  type: string;
  male: number;
  female: number;
};

export type AttendanceRecord = {
  id: number;
  uuid: string;
  recordedById: string;
  location: string;
  service: string;
  totalMale: number;
  totalFemale: number;
  total: number;
  attendanceDate: string;
  createdAt: string;
  updatedAt: string;
  breakdowns: Breakdown[];
};

export type AttendanceField =
  | "NONSTUDENT_MALE" | "NONSTUDENT_FEMALE"
  | "STUDENT_MALE" | "STUDENT_FEMALE"
  | "YOUTH_MALE" | "YOUTH_FEMALE"
  | "CHILDREN_MALE" | "CHILDREN_FEMALE"
  | "GUEST_MALE" | "GUEST_FEMALE"
  | "NEWCOMER_MALE" | "NEWCOMER_FEMALE"
  | "CONVERT_MALE" | "CONVERT_FEMALE"
  | "TOTAL";

export type AttendanceData = {
    recordedById: string;
    location: LOCATION;
    service: SERVICE;
    serviceDate: string;
    sMale: number;
    sFemale: number;
    nsMale: number;
    nsFemale: number;
    yMale: number;
    yFemale: number;
    chMale: number;
    chFemale: number;
    conMale: number;
    conFemale: number;
    ncMale: number;
    ncFemale: number;
    gMale: number;
    gFemale: number;
}
