import "server-only";
import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export class Session {
    public static async createSession(userId: string) {
        const token = jwt.sign(
            { userId},
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        const cookiesStore = await cookies();

        cookiesStore.set("noisses", token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: 'lax',
            path: '/',
        });

    }
    public static async refreshToken(req: UNextRequest) {
        try{
            const refreshToken = req.cookies.get("noisses_hserfer")?.value;
            if (!refreshToken) {
                throw new Error("Refresh token not found.");
            }

            const payload = await verifyJWTToken(refreshToken, "refresh") as JwtPayload;
            const newToken = jwt.sign(
                { userId: payload?.userId, fellowshipId: payload.fellowshipId },
                process.env.JWT_SECRET as string,
                { expiresIn: "7d" }
            )

            Session.updateSession(newToken);
        }catch(error){
            throw error;
        }
    }



    public static async updateSession(token: string) {
        const cookiesStore = await cookies();
            
        cookiesStore.set("noisses", token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
            sameSite: 'lax',
        })
    }

    public static async destroySession() {
        const cookiesStore = await cookies();
            
        cookiesStore.delete("noisses");
    }
}