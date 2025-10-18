import { LOCATION, UserType } from "@/lib/generated/prisma";

export type TUser = {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
    location: LOCATION;
}