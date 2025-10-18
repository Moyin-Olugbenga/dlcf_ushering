import { LOCATION, SERVICE } from "@/lib/generated/prisma";
import z from "zod";

export const AttendanceSchema = z.object({
  recordedById: z.string().min(3, {message: "You need to be authenticated before inserting attendance records"}),
  location: z.enum(LOCATION),
  service: z.enum(SERVICE),
  serviceDate: z.string().min(3, {message: "Service date should have at least 3 characters"}),
  sMale: z.number().min(0, {message: "Male students count cannot be negative"}),
  sFemale: z.number().min(0, {message: "Female students count cannot be negative"}),
  nsMale: z.number().min(0, {message: "Male non-students count cannot be negative"}),
  nsFemale: z.number().min(0, {message: "Female non-students count cannot be negative"}),
  yMale: z.number().min(0, {message: "Male youth count cannot be negative"}),
  yFemale: z.number().min(0, {message: "Female youth count cannot be negative"}),
  chMale: z.number().min(0, {message: "Male children count cannot be negative"}),
  chFemale: z.number().min(0, {message: "Female children count cannot be negative"}),
  conMale: z.number().min(0, {message: "Male converts count cannot be negative"}),
  conFemale: z.number().min(0, {message: "Female converts count cannot be negative"}),
  ncMale: z.number().min(0, {message: "Male new converts count cannot be negative"}),
  ncFemale: z.number().min(0, {message: "Female new converts count cannot be negative"}),
  })
