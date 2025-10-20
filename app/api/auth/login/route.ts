"use server";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "@/classes/Session.class";
import { UserSignInData } from "@/app/types/auth";
import { SignInSchema } from "../../schemaDefinitions/AuthSchema";
import { Auth } from "@/classes/Auth.class";

export const POST = async(req: NextRequest) => {
    try{
        
        
        const data: UserSignInData = await req.json();
        const isValid = SignInSchema.safeParse(data);

        if (!isValid.success) {
            throw new Error('Invalid input');
        }
        const auth = await Auth.SignIn(data);
        if (!auth || auth?.error == true) {
            return NextResponse.json({error: true, message: auth?.message ? auth?.message : "Invalid login details", status: 401});
        }

        const session = await Session.createSession(auth.uuid as string);
        if (!session) {
            return NextResponse.json({error: true, message: "Error creating session", status: 500});
        }
        // console.log(auth);
        return NextResponse.json(
            {
                message: "User logged in successfully",
                error: false,
                data: auth,
                status: 200
            }
        )
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "An error occurred while logging in the user.", status: 500});
    }
}