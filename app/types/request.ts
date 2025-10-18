import { NextRequest } from "next/server";
import { TUser } from "./user";

export interface UNextRequest extends NextRequest {
    user: TUser;
}