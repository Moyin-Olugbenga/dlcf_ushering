
import { AuthResponse } from "@/app/interfaces/auth.interface";
import { ForgotPasswordData, ResetPasswordData, UpdatePasswordData, UserSignInData, UserSignUpData } from "@/app/types/auth";
import { UNextRequest } from "@/app/types/request";
import { database } from "@/config/db";
import axios from "axios";
import * as bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { uuid } from "zod";
import { Session } from "./Session.class";


export class Auth {
    public static async SignUp(data: UserSignUpData) {
    const { confirmPassword, ...userData } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(data.password, salt);
    const userExists = await database.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userExists) {
      throw new Error('User already exists');
    }
    const user = await database.user.create({
      data: {
        ...userData,
        password: hashedPassword
      },
    });

    if (!user) {
      throw new Error('Error creating user');
    }
    const response: AuthResponse = {
      message: 'User successfully Registered',
      uuid: user.uuid,
      userType: user.usertype,
    };
    return response;
  }


  public static async SignIn(data: UserSignInData) {
    const user = await database.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const password_verify = await bcrypt.compare(data.password, user?.password);

    if (!password_verify) {
      throw new Error('Invalid login details');
    }
    const response : AuthResponse = {
      message: 'User logged in successfully',
      uuid: user.uuid,
      email: user.email,
      userType: user.usertype,
    };
    return response;
  }

  
    public static async verifyToken(req: UNextRequest): Promise<unknown> {
      try {
        const token = req?.cookies.get("noisses")?.value;
        if(!token) {
          throw new Error("Token Not Found")
        }
        const payload = await jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if(payload){
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_LINK}/api/user/${payload?.userId}`);
          req.user = data.user;
          
          if(!req.user){
              return this.invalidAuth();
          }

          return NextResponse.next();
        }
        return this.invalidAuth();
      } catch (error) {
        console.error(error);
        await this.refreshToken(req);
        NextResponse.next();
      }
    }
    public static async refreshToken(req: UNextRequest) {
        try{
            const refreshToken = req.cookies.get("noisses_nekot")?.value;
            if (!refreshToken) {
                throw new Error("Refresh token not found.");
            }

            const payload = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
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


  public static async invalidAuth() {
    return NextResponse.json({ error: "Invalid authentication" }, { status: 401 });
  } 

  public static async forgotPassword(data: ForgotPasswordData) {
    const user = await database.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new Error("Email doesn't exist in our database");
    }

    const token = await this.createOtp();
    const link = `${process.env.APP_LINK}/auth/resetPassword?token=${token}&email=${data.email}`;
    // await sendEmail.sendMail({
    //   to: data.email,
    //   subject: 'Password Reset Link',
    //   html: `<p>Your link for password reset is: <strong><a href="${link}">Reset</a></strong></p><p>This link is valid for 10 minutes.</p>If you have issues clicking the link, please copy this code into your browser.<p><p>${link}</p>`,
    // });
    return { message: 'Password reset link has been sent to your email', data: { link } };
  }

  async resetPassword(data: ResetPasswordData) {
    try {
      console.log(data);
      const user = await database.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (!user) {
        throw new Error("Email doesn't exist in our database");
      }

      const isValid = jwt.verify(data.token, process.env.EMAIL_SECRET as string);
      if (!isValid) {
        throw new Error('Invalid or expired link');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.newPassword, salt);
      await database.user.update({
        where: {
          email: data.email,
        },
        data: {
          password: hashedPassword,
        },
      });
      return { message: 'Password reset successfully' };
    } catch (error) {
      console.log(error);
      throw new Error('Invalid or expired link');
    }
  }

  
  async updatePassword(userId: string, data: UpdatePasswordData) {
    const user = await database.user.findUnique({
      where: {
        uuid: userId,
      },
    });
    if (!user) {
      throw new Error('Forbidden access');
    }
    const password_verify = await bcrypt.compare(data.oldPassword, user?.password);

    if (!password_verify) {
      throw new Error('Incorrect password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(data.newPassword, salt);
    await database.user.update({
      where: {
        uuid: userId,
      },
      data: {
        password: hashedNewPassword,
      },
    });
    return {
      message: 'Password updated successfully',
    };
  }

  public static async createOtp() {
    const otp = uuid();
    const emailToken = await jwt.sign(
      { otp },
      process.env.EMAIL_SECRET as string,
      { expiresIn: "10m" }
    );
    return emailToken;
  } 
}