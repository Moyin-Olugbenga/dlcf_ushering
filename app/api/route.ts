'use server'

import { database } from '@/prisma/config'
import  { attendanceSchema} from '@/app/schema/attendance'
import { revalidatePath } from 'next/cache'


export async function submitAttendance(formData: FormData) {
  const raw = {
    recordedBy: formData.get('recordedBy'),
    location: formData.get('location'),
    serviceType: formData.get('serviceType'),
    s_male: formData.get('s_male'),
    s_female: formData.get('s_female'),
    ns_male: formData.get('ns_male'),
    ns_female: formData.get('ns_female'),
    y_male: formData.get('y_male'),
    y_female: formData.get('y_female'),
    ch_male: formData.get('ch_male'),
    ch_female: formData.get('ch_female'),
    con_male: formData.get('con_male'),
    con_female: formData.get('con_female'),
    nc_male: formData.get('nc_female'),
    nc_female: formData.get('nc_male'),
    serviceDate: formData.get('serviceDate'),
  }

  

  const parsed = attendanceSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data;

  const totalMale = Number(data.s_male) + Number(data.ns_male) +  Number(data.ch_male) + Number(data.y_male);
  const totalFemale = Number(data.s_female) + Number(data.ns_female) + Number(data.ch_female) + Number(data.y_female) ;
  const total = totalFemale + totalMale;
    

  await database.attendance.create({
    data: {
      recordedBy: data.recordedBy,
      location: data.location,
      service: data.serviceType,
      totalFemale: totalFemale,
      totalMale: totalMale,
      total: total,
      attendanceDate: new Date(data.serviceDate),
      breakdowns: {
        create: [
          {
            type: 'STUDENT',
            male: Number(data.s_male),
            female: Number(data.s_female),
          },
          {
            type: 'NON_STUDENT',
            male: Number(data.ns_male),
            female: Number(data.ns_female),
          },
          {
            type: 'YOUTH',
            male: Number(data.y_male),
            female: Number(data.y_female),
          },
          {
            type: 'CHILDREN',
            male: Number(data.ch_male),
            female: Number(data.ch_female),
          },
          {
            type: 'CONVERT',
            male: Number(data.con_male),
            female: Number(data.con_female),
          },
          {
            type: 'NEWCOMER',
            male: Number(data.nc_male),
            female: Number(data.nc_female),
          },
        ],
      },
    },
  })

//   revalidatePath('/dashboard')

  return { success: true }
}
