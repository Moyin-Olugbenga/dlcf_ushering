import { z } from 'zod'

export const attendanceSchema = z.object({
  recordedBy: z.string().min(2, 'Name is too short'),
  location: z.enum(['EDE_ROAD', 'DAMICO', 'RELIGION_GROUND', 'CORPERS', 'MOREMI', 'ELEYELE', 'ROAD7', 'PG', 'OMOLE', 'QUARTERS', 'AJEBAMIDELE', 'IJEDU', 'URBAN_DAY', 'OAU_THC', 'KOIWO', 'CDL']),
  serviceType: z.enum(['SWS', 'MBS', 'TRH', 'SWM', 'GCK_DAY1','GCK_DAY2', 'GCK_DAY3', 'GCK_DAY4', 'GCK_DAY5', 'GCK_DAY6']),
  s_male: z.coerce.number().min(0),
  s_female: z.coerce.number().min(0),
  ns_male: z.coerce.number().min(0),
  ns_female: z.coerce.number().min(0),
  y_male: z.coerce.number().min(0),
  y_female: z.coerce.number().min(0),
  ch_male: z.coerce.number().min(0),
  ch_female: z.coerce.number().min(0),
  con_male: z.coerce.number().min(0),
  con_female: z.coerce.number().min(0),
  nc_male: z.coerce.number().min(0),
  nc_female: z.coerce.number().min(0),
  serviceDate: z.coerce.date(),
})


export type AttendanceFormData = z.infer<typeof attendanceSchema>
