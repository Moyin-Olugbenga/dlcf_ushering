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
import { signInSchema } from "@/app/api/schemaDefinitions/AuthSchema";
import axios from "axios";
import { useState } from "react";

export function LoginForm() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setErrors] = useState("");
    const router = useRouter(); 


    const initialValues : UserSignInData = {
        
        username: "",
        password: "",
    }
    try {
  
    
    return (
        <Formik
            initialValues={initialValues}
            validate={async (values) => {
                const validateFn = await Utility.zodValidate(signInSchema);
                return validateFn(values);
            }}
            onSubmit={async (values) => {
                try{
                    setIsSubmitting(true);
                    const {data} = await axios.post("/api/auth/login", {...values});
                    if (data.error == true) {
                        
                      setErrors(data.message);
                    } else {
                    router.push(`/dashboard`);
                        // setMessage("Faculty created successfully!");
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
              {error && <p>{error}</p>}
        <CardHeader className="text-center">
          <CardTitle className="text-xl">DLCF OAU</CardTitle>
          <CardDescription>
            Login with your Credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form  method="POST" onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 p-6 shadow-md rounded-xl">
             <div className="grid gap-6">
              {error && <p>{error}</p>}
              {message && <p className="success-feedback">{message}</p>}

              <div className="grid gap-6">
                
                <div className="grid gap-1">
                  <Label htmlFor="username" className="py-2">Username</Label>
                  <Input 
                      id="username" 
                      name="username"
                      value={values?.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required 
                  />
                  {touched?.username && errors?.username && <div className='error-feedback'>{errors?.username}</div>}
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
                <Button type="submit" className="w-full" disabled={isSubmitting}> 
                 {isSubmitting ? 'Signing In....' : 'Sign In'}
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
