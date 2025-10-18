"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
 

  return  (
    
  <div className="flex justify-center items-center ">
    <Card className="w-full max-w-sm my-10">
      <CardHeader>
        <Image src="/dlcfOAU.jpeg" alt="DLCF Logo" width={120} height={120} className="mx-auto mt-4"/>
        <CardTitle className="text-xl">Deeper Life Campus Fellowship</CardTitle>
        <CardDescription>
          Attendance report for the different locations <p></p>
          <Link href="/signUp" className="text-lg text-center text-blue-600 hover:underline">
            Don&apos;t have an account? Sign Up
          </Link><br></br>

          <Link href="/login" className="text-lg text-center text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        <CardAction>
        </CardAction>
      </CardContent>
    </Card>
    </div>
  )
}
