
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import axios from "axios";
import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
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
             const {data} =  await axios.get(`${llink}/api/tokens`);
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

            
            const {data} =  await axios.post(`${llink}/api/tokens/create`, {
                token, random_password, hash
             });
             
             return data?.data;
        } catch(err) {
           console.error(err);
            return NextResponse.json({error: "An error occurred while fetching the tokens."}, {status: 500});
 
        }
    }
    private static async generateToken(n: number) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = '';
        for(let i = 0; i < n; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
        


    public static async verifyUserToken(req: NextRequest, token: string): Promise<unknown> {
        try {
            if(!token) {
                // throw new AuthError("Admin Not Found")
            }
            
            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

           if(payload){
                // const { data } = await axiosFetch.get(`/api/user/${payload?.userId}`);
                // req.user = data.user;
                
                // if(!req.user){
                //     return this.invalidAuth();
                // }

                return NextResponse.next();
            }else{
        return NextResponse.json({ error: "Invalid authentication" }, { status: 401 });
            
            NextResponse.next();
        }
            
            
        } catch (error) {
            if(error instanceof TokenExpiredError) {
                NextResponse.next();
            }
            console.error("Error authenticating user:", error);
            throw error;
        }
    }
    
}