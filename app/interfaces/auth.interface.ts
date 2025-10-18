// import { UserType } from 'app/generated/prisma';

export interface AuthResponse {
  message: string;
  uuid?: string;
  email?: string;
  userType?: string;
  error?: boolean;
}


export interface EmailTokenPayload {
  email: string;
  iat: number;
  exp: number;
}
