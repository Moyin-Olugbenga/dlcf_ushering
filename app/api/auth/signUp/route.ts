"use server";
import { NextRequest, NextResponse } from "next/server";
import { Auth } from "@/classes/Auth.class";
import { UserSignUpData } from "@/app/types/auth";
import { SignUpSchema } from "../../schemaDefinitions/AuthSchema";

export const POST = async(req: NextRequest) => {
    try{
        const dto: UserSignUpData = await req.json();
        const isValid = SignUpSchema.safeParse(dto);

        if (!isValid.success) {
            throw new Error('Invalid input');
        }
        const auth = await Auth.SignUp(dto);
        return NextResponse.json({ error: false, data: auth, status: 200 });

    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Unknown error occurred", status: 500 });
    }
}