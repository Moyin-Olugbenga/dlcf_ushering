
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import axios from "axios";
import { Prisma } from "@/lib/generated/prisma";

const llink = process.env.NEXT_PUBLIC_API_LINK as string;

export type TokenResult = Prisma.AdminGetPayload<{
    select: {
        id: true,
        username: true,
        pass: true,
    }
}>


export class Token {
    public static async getTokens() : Promise<any> {
        try {
             const {data} =  await axios.get(`${llink}/api/token`);
             return data?.data;

        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching the tokens."}, {status: 500});
 
        }
    }

    public static async createToken() {
        try {

            const random = await this.generateToken(4);
            const token = "dlcfadmin_" + random;
            const random_password = await this.generateToken(8);
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(random_password, salt)

            
            const {data} =  await axios.post(`${llink}/api/token/create`, {
                token, random_password, hash
             });
             
             return data?.data;
        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching the tokens."}, {status: 500});
 
        }
    }
    private static async generateToken(n: number) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var token = '';
        for(var i = 0; i < n; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
        
    
}