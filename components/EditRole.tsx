"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { LOCATION, UserType } from "@/lib/generated/prisma/client";
import { TUser } from "@/app/types/user";
import { EditUserSchema } from "@/app/api/schemaDefinitions/AuthSchema";

export function EditRole({
    user
} : {
    user: TUser
}) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setErrors] = useState("");
    const [success, setSuccess] = useState("");

    const initialValues : TUser = {
      uuid: user.uuid,
      email: user.email,
      location: user.location,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
    }
    try {
    return (
        <Formik
            initialValues={initialValues}
            validate={async (values) => {
              console.log("Validating values:", values);
                const validateFn = await Utility.zodValidate(EditUserSchema);
                return validateFn(values);
            }}
            onSubmit={async (values) => {
                try{
                    setIsSubmitting(true);
                    const {data} = await axios.post("/api/user/edit", {...values});
                    if (data.error == true) {
                      setErrors(data.message);
                    } 
                    else {
                      setSuccess("User upgraded successfully");
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
                  <Label><b>First name</b></Label>

                      <Input type="text" placeholder="First name" name="firstName" value={values.firstName} onChange={handleChange} onBlur={handleBlur} required  />

                  {touched?.firstName && errors?.firstName && <div className='error-feedback'>{errors?.firstName}</div>}
                 </div>
                
                <div className="grid gap-1">
                  <Label><b>Last name</b></Label>

                      <Input type="text" placeholder="Last name" name="lastName" value={values.lastName} onChange={handleChange} onBlur={handleBlur} required  />

                  {touched?.lastName && errors?.lastName && <div className='error-feedback'>{errors?.lastName}</div>}
                 </div>
                
                <div className="grid gap-1">
                  <Label><b>Email</b></Label>

                      <Input type="email" placeholder="Email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} required  />

                  {touched?.email && errors?.email && <div className='error-feedback'>{errors?.email}</div>}
                 </div>
                
                            
                <div className="grid gap-1">
                    <Label htmlFor="">Service</Label>
                  <div className="flex items-center">
                    <Select name="userType" value={values.userType} onValueChange={(e) => setFieldValue("userType", e)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the userType Day" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value={UserType.USHER}>Usher</SelectItem>
                          <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserType.SUPERADMIN}>Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.userType && <p className="text-red-500 text-sm">{errors.userType[0]}</p>}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="">Location</Label>
                  <div className="flex items-center">
                    <Select name="location" value={values?.location} onValueChange={(e) => setFieldValue("location", e)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value={LOCATION.RELIGION_GROUND}>Religion Ground</SelectItem>
                          <SelectItem value={LOCATION.EDE_ROAD}>Ede road</SelectItem>
                          <SelectItem value={LOCATION.DAMICO}>Damico</SelectItem>
                          <SelectItem value={LOCATION.KOIWO}>Koiwo</SelectItem>
                          <SelectItem value={LOCATION.URBAN_DAY}>Urban day</SelectItem>
                          <SelectItem value={LOCATION.ELEYELE}>Eleyele</SelectItem>
                          <SelectItem value={LOCATION.AJEBAMIDELE}>Ajebamidele</SelectItem>
                          <SelectItem value={LOCATION.ROAD7}>Road 7</SelectItem>
                          <SelectItem value={LOCATION.QUARTERS}>Quarters</SelectItem>
                          <SelectItem value={LOCATION.PG}>PG</SelectItem>
                          <SelectItem value={LOCATION.MOREMI}>Moremi Estate</SelectItem>
                          <SelectItem value={LOCATION.CORPERS}>Corpers</SelectItem>
                          <SelectItem value={LOCATION.IJEDU}>Ijedu</SelectItem>
                          <SelectItem value={LOCATION.OAU_THC}>OAUTHC</SelectItem>
                          <SelectItem value={LOCATION.CDL}>CDL</SelectItem>
                          <SelectItem value={LOCATION.OMOLE}>Omole</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.location && <p className="text-red-500 text-sm">{errors.location[0]}</p>}
                </div>
    
              </div>
              <div  className="flex-col gap-1"> 
                <Button type="submit" className="w-full bg-[#8b2e2e] hover:bg-[#b72f2f]" disabled={isSubmitting} style={{ marginTop: '1.5rem' }}>
                  {isSubmitting ? 'Submitting...' : 'Edit User'}
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
