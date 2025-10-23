"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik } from "formik";
import { Utility } from "@/classes/Utility.class";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import { AttendanceType, SERVICE } from "@/lib/generated/prisma/client";
import { AttendanceData, AttendanceRecord } from "@/app/types/attendance";
import { AttendanceSchema } from "@/app/api/schemaDefinitions/Attendance";
import { TUser } from "@/app/types/user";

export function EditAttendance(  {
        user,
        attendance
    } : {user:TUser; attendance: AttendanceRecord;} ) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    
console.log(attendance);
    const initialValues : AttendanceData = {
      recordedById: user.uuid,
      location: user.location,
      service: attendance?.service,
      serviceDate: attendance.attendanceDate,
      sMale:attendance.breakdowns.find(b => b.type == AttendanceType.STUDENT && b.male >= 0)?.male || 0 ,
      sFemale:attendance.breakdowns.find(b => b.type == AttendanceType.STUDENT && b.female >= 0)?.female || 0 ,
      nsMale:attendance.breakdowns.find(b => b.type == AttendanceType.NON_STUDENT && b.male >= 0)?.male || 0 ,
      nsFemale:attendance.breakdowns.find(b => b.type == AttendanceType.NON_STUDENT && b.female >= 0)?.female || 0 ,
      yMale:attendance.breakdowns.find(b => b.type == AttendanceType.YOUTH && b.male >= 0)?.male || 0 ,
      yFemale:attendance.breakdowns.find(b => b.type == AttendanceType.YOUTH && b.female >= 0)?.female || 0 ,
      chMale:attendance.breakdowns.find(b => b.type == AttendanceType.CHILDREN && b.male >= 0)?.male || 0 ,
      chFemale:attendance.breakdowns.find(b => b.type == AttendanceType.CHILDREN && b.female >= 0)?.female || 0 ,
      conMale:attendance.breakdowns.find(b => b.type == AttendanceType.CONVERT && b.male >= 0)?.male || 0 ,
      conFemale:attendance.breakdowns.find(b => b.type == AttendanceType.CONVERT && b.female >= 0)?.female || 0 ,
      ncMale:attendance.breakdowns.find(b => b.type == AttendanceType.NEWCOMER && b.male >= 0)?.male || 0 ,
      ncFemale:attendance.breakdowns.find(b => b.type == AttendanceType.NEWCOMER && b.female >= 0)?.female || 0 ,
      gMale:attendance.breakdowns.find(b => b.type == AttendanceType.GUEST && b.male >= 0)?.male || 0 ,
      gFemale:attendance.breakdowns.find(b => b.type == AttendanceType.GUEST && b.female >= 0)?.female || 0 ,
    }
    try {
    return (
        <Formik
            initialValues={initialValues}
            validate={async (values) => {
                const validateFn = await Utility.zodValidate(AttendanceSchema);
                return validateFn(values);
            }}
            onSubmit={async (values) => {
                try{
                    setIsSubmitting(true);
                    const {data} = await axios.post("/api/attendance/edit", {...values});
                    if (data.error == true) {
                      setErrors(data.message);
                    } 
                    else {
                      setSuccess("Attendance edited successfully");
                    }
                    setIsSubmitting(false);
                }catch(error){
                    console.log({error});
                    setIsSubmitting(false);
                }
            }}
        >
            {
                ({ values, errors, touched, setFieldValue, handleBlur, handleChange, handleSubmit }) => (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
        <Image src="/dlcfOAU.jpeg" alt="DLCF Logo" width={120} height={120} className="mx-auto mt-4"/>
        <h2 className="text-xl">DLCF OAU</h2>
          <CardTitle className="text-md">Edit Attendance</CardTitle>
          <CardDescription>
              {error && <p>{error}</p>}
           
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form  method="POST" onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 p-6 shadow-md rounded-xl">
             <div className="grid gap-6">
              {error && 
              <p className="error-feedback">
                <div role="alert" className="rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <strong className="font-medium text-gray-900"> Success</strong>
                        <p className="mt-0.5 text-sm text-gray-700">{error}</p>
                      </div>
                      <button
                        className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                        type="button"
                        aria-label="Dismiss alert"
                      >
                        <span className="sr-only">Dismiss popup</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </p>
                 } 
              {success && 
              <p className="success-feedback">
                <div role="alert" className="rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <strong className="font-medium text-gray-900"> Success</strong>
                        <p className="mt-0.5 text-sm text-gray-700">{success}</p>
                      </div>
                      <button
                        className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                        type="button"
                        aria-label="Dismiss alert"
                      >
                        <span className="sr-only">Dismiss popup</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </p>
                 } 

              <div className="grid gap-6">
                
                <div className="grid gap-1">
                  <Label><b>Students(male first)</b></Label>
                  
                  <div className="flex space-x-4"> 
                      <Input type="number" placeholder="Male" value={values.sMale} onChange={handleChange} onBlur={handleBlur} required  />
                      <Input type="number" placeholder="Female" value={values.sFemale} onChange={handleChange} onBlur={handleBlur} required  />
                  </div>
                  {touched?.sMale && errors?.sMale && <div className='error-feedback'>{errors?.sMale}</div>}
                  {touched?.sFemale && errors?.sFemale && <div className='error-feedback'>{errors?.sFemale}</div>}
                </div>
                <div className="grid gap-1">
                  <Label><b>Non Students(male first)</b></Label>
                  <div className="flex space-x-4"> 
                      <Input type="number" placeholder="Male" value={values.nsMale} onChange={handleChange} onBlur={handleBlur} required  />
                      <Input type="number" placeholder="Female" value={values.nsFemale} onChange={handleChange} onBlur={handleBlur} required  />
                  </div>
                  {touched?.nsMale && errors?.nsMale && <div className='error-feedback'>{errors?.nsMale}</div>}
                  {touched?.nsFemale && errors?.nsFemale && <div className='error-feedback'>{errors?.nsFemale}</div>}
              
                </div>
                <div className="grid gap-1">
                  <Label><b>Youth(male first)</b></Label>
                  <div className="flex space-x-4"> 
                      <Input type="number" placeholder="Male" value={values.yMale} onChange={handleChange} onBlur={handleBlur} required  />
                      <Input type="number" placeholder="Female" value={values.yFemale} onChange={handleChange} onBlur={handleBlur} required  />
                  </div>
                  {touched?.yMale && errors?.yMale && <div className='error-feedback'>{errors?.yMale}</div>}
                  {touched?.yFemale && errors?.yFemale && <div className='error-feedback'>{errors?.yFemale}</div>}
                </div>
                <div className="grid gap-1">
                  <Label><b>Children(male first)</b></Label>

                  <div className="flex space-x-4">
                      <Input type="number" placeholder="Male" value={values.chMale} onChange={handleChange} onBlur={handleBlur} required  />
                      <Input type="number" placeholder="Female" value={values.chFemale} onChange={handleChange} onBlur={handleBlur} required  />
                  </div>
                  {touched?.chMale && errors?.chMale && <div className='error-feedback'>{errors?.chMale}</div>}
                  {touched?.chFemale && errors?.chFemale && <div className='error-feedback'>{errors?.chFemale}</div>}
                </div>
                
                <div className="grid gap-1">
                  <Label><b>Converts(male first)</b></Label>
                  
                  <div className="flex space-x-4"> 
                      <Input type="number" placeholder="Male" value={values.conMale} onChange={handleChange} onBlur={handleBlur} required  />
                      <Input type="number" placeholder="Female" value={values.conFemale} onChange={handleChange} onBlur={handleBlur} required  />
                  </div>
                  {touched?.conMale && errors?.conMale && <div className='error-feedback'>{errors?.conMale}</div>}
                  {touched?.conFemale && errors?.conFemale && <div className='error-feedback'>{errors?.conFemale}</div>}
                </div>
                
                <div className="grid gap-1">
                  <Label><b>Newcomers(male first)</b></Label>
                  
                  <div className="flex space-x-4"> 
                      <Input type="number" placeholder="Male" value={values.ncMale} onChange={handleChange} onBlur={handleBlur} required  />
                      <Input type="number" placeholder="Female" value={values.ncFemale} onChange={handleChange} onBlur={handleBlur} required  />
                  </div>
                  {touched?.ncMale && errors?.ncMale && <div className='error-feedback'>{errors?.ncMale}</div>}
                  {touched?.ncFemale && errors?.ncFemale && <div className='error-feedback'>{errors?.ncFemale}</div>}
                </div>
                <div className="grid gap-1">
                  <Label><b>Guests(male first)</b></Label>
                  <div className="flex space-x-4"> 
                      <Input type="number" placeholder="Male" value={values.gMale} onChange={handleChange} onBlur={handleBlur} required  />
                      <Input type="number" placeholder="Female" value={values.gFemale} onChange={handleChange} onBlur={handleBlur} required  />
                  </div>
                  {touched?.gMale && errors?.gMale && <div className='error-feedback'>{errors?.gMale}</div>}
                  {touched?.gFemale && errors?.gFemale && <div className='error-feedback'>{errors?.gFemale}</div>}
                </div>
                
                <div className="grid gap-1">
                    <Label htmlFor="">Service Date</Label>
                  <div className="flex items-center">
                    <Input type="date" name="date" value={values.serviceDate} onChange={handleChange} onBlur={handleBlur} required />
                  </div>
                  {touched?.serviceDate && errors?.serviceDate && <div className='error-feedback'>{errors?.serviceDate}</div>}
                </div>
                            
                            
                <div className="grid gap-1">
                    <Label htmlFor="">Service</Label>
                  <div className="flex items-center">
                    <Select name="service" value={values.service} onValueChange={(e) => setFieldValue("service", e)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the Service Day" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value={SERVICE.SWS}>Sunday Worship Service</SelectItem>
                          <SelectItem value={SERVICE.MBS}>Monday Bible Study</SelectItem>
                          <SelectItem value={SERVICE.SWM}>Saturday Workers Meeting</SelectItem>
                          <SelectItem value={SERVICE.TRH}>Thursday Revival Hour</SelectItem>
                          <SelectItem value={SERVICE.GCK_DAY1}>GCK Day 1</SelectItem>
                          <SelectItem value={SERVICE.GCK_DAY2}>GCK Day 2</SelectItem>
                          <SelectItem value={SERVICE.GCK_DAY3}>GCK Day 3</SelectItem>
                          <SelectItem value={SERVICE.GCK_DAY4}>GCK Day 4</SelectItem>
                          <SelectItem value={SERVICE.GCK_DAY5}>GCK Day 5</SelectItem>
                          <SelectItem value={SERVICE.GCK_DAY6}>GCK Day 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.service && <p className="text-red-500 text-sm">{errors.service[0]}</p>}
                </div>
    
              </div>
              <div  className="flex-col gap-1"> 
                <Button variant="outline" type="submit" disabled={isSubmitting} style={{ marginTop: '1.5rem' }}>
                  {isSubmitting ? 'Editing...' : 'Edit Attendance'}
                </Button>
              </div>
              </div>
           </form>
        </CardContent>
      </Card>
    </div>
            )
        }
        </Formik>
    )
} catch (err) {
  console.error("Form crashed:", err);
  return <div>Form failed: {String(err)}</div>;
}
}
