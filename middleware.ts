import { Token } from "@/classes/Token.class";
import { NextResponse, NextRequest } from "next/server";
export const config = {
//   matcher: ["/api/:path*"], 
  runtime: "nodejs",        
};

export const middleware = async(req: NextRequest) => {

    // authenticate users for specific routes
    if(req.nextUrl.pathname.startsWith("/attendance")){
        try{
           const token = req?.cookies.get("noisses")?.value;
            await Token.verifyUserToken(req, token);
        }catch(error){
            console.log(error)
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_LINK}/login`);
        }
    }

    return NextResponse.next();
}

