"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Formik } from "formik";
import { Utility } from "@/classes/Utility.class";
import { SignInSchema } from "@/app/api/schemaDefinitions/AuthSchema";
import axios from "axios";
import { useState } from "react";
import { UserSignInData } from "@/app/types/auth";
import { UserType } from "@/lib/generated/prisma";
import Image from "next/image";
import Link from "next/link";

export function LoginForm() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setErrors] = useState("");
    const router = useRouter(); 


    const initialValues : UserSignInData = {
        email: "",
        password: "",
    }
    try {
  
    
    return (
        <Formik
            initialValues={initialValues}
            validate={async (values) => {
                const validateFn = await Utility.zodValidate(SignInSchema);
                return validateFn(values);
            }}
            onSubmit={async (values) => {
                try{
                    setIsSubmitting(true);
                    const {data} = await axios.post("/api/auth/login", {...values});
                   if (data.error == true) {
                        
                      setErrors(data.message);
                    } 
                    else {
                      if (data.data.userType ==  UserType.ADMIN) {
                        router.push(`/workspace/admin`);

                      }
                      else if (data.data.userType ==  UserType.USHER) {
                        router.push(`/workspace/usher`);

                      }
                      else {
                        router.push(`/workspace/superAdmin`);

                      }
                    }
    
                    setIsSubmitting(false);
                }catch(error){
                    console.log({error});
                    setIsSubmitting(false);
                }
            }}
      >
      {
                      ({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center">
              <Image src="/dlcfOAU.jpeg" alt="DLCF Logo" width={120} height={120} className="mx-auto mt-4"/>
                    
          <CardTitle className="text-xl">DLCF OAU</CardTitle>
          <CardDescription>
            Login with your Credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form  method="POST" onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 p-6 shadow-md rounded-xl">
             <div className="grid gap-6">
              {error && <p className="error-feedback">
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
                        <strong className="font-medium text-gray-900"> Error</strong>
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
                </p>}

              <div className="grid gap-6">
                
                <div className="grid gap-1">
                  <Label htmlFor="email" className="py-2">email</Label>
                  <Input 
                      id="email" 
                      name="email"
                      value={values?.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required 
                  />
                  {touched?.email && errors?.email && <div className='error-feedback'>{errors?.email}</div>}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password" className="py-2">Password</Label>
                  <Input 
                      id="password" 
                      name="password"
                      type="password"
                      value={values?.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required 
                  />
                    {touched?.password && errors?.password && <div className='error-feedback'>{errors?.password}</div>}
                </div>
                <Button type="submit" className="w-full bg-[#8b2e2e] hover:bg-[#b72f2f]" disabled={isSubmitting}> 
                 {isSubmitting ? 'Signing In....' : 'Sign In'}
                </Button>
                <Link href="/signUp" className="text-sm text-center text-blue-600 hover:underline">
                  Don&apos;t have an account? Sign Up
                </Link>
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
