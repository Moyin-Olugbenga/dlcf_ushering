import { LOCATION, UserType } from "@/lib/generated/prisma";

export type UserSignInData = {
    email: string;
    password: string;
}

export type UserSignUpData = {
    firstName: string;
    location: LOCATION;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type ForgotPasswordData = {
    email: string;
}

export type ResetPasswordData = {
    newPassword: string;
    token: string;
    email: string;
    confirmNewPassword: string;
}

export type UpdatePasswordData = {
    uuid: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
export type EditUserData = {
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    location: LOCATION
}