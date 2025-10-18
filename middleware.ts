import { Token } from "@/classes/Token.class";
import { NextResponse } from "next/server";
import { UNextRequest } from "./app/types/request";
import { Auth } from "./classes/Auth.class";
export const config = {
//   matcher: ["/api/:path*"], 
  runtime: "nodejs",        
};

export const middleware = async(req: UNextRequest) => {

    // authenticate users for specific routes
    if(req.nextUrl.pathname.startsWith("/workspace")){
        try{
            await Auth.verifyToken(req);
        }catch(error){
            console.log(error)
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_LINK}/login`);
        }
    }

    return NextResponse.next();
}

