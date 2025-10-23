import { LOCATION, UserType } from "@/lib/generated/prisma";
import z from "zod";

const passwordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
);
export const SignUpSchema = z.object({
  firstName: z.string().min(3, {message: "Firstname should have at least 3 characters"}),
  lastName: z.string().min(3, {message: "Lastname should have at least 3 characters"}), 
  email: z.string().email({message: "Email format is not correct"}),
  location: z.enum(LOCATION),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." })
    .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
     }),
  confirmPassword: z.string({message: "Please  confirm your password"})
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  })

export const SignInSchema = z.object({
  email: z.string().email({message: "Email format is not correct"}),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." })
      .max(32, { message: "Password must be at most 32 characters long." })
      .refine((password: string) => /[A-Z]/.test(password), { message: "Password must contain at least one uppercase letter." })
      .refine((password: string) => /[a-z]/.test(password), { message: "Password must contain at least one lowercase letter." })
      .refine((password: string) => /[0-9]/.test(password), { message: "Password must contain at least one number." })
      .refine((password: string) => /[!@#$%^&*()-_+={[}]|:;"'<,>.?]/g.test(password), { message: "Password must contain at least one special character." }),
});


export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmNewPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
  });

export const ResetPasswordParamSchema = z.object({
  token: z.string({ message: 'Token not found' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string({ message: 'Type in your Old Password' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmNewPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
  });

  export const EditUserSchema = z.object({
    firstName: z.string().min(3, {message: "Firstname should have at least 3 characters"}),
    lastName: z.string().min(3, {message: "Lastname should have at least 3 characters"}), 
    email: z.string().email({message: "Email format is not correct"}),
    location: z.enum(LOCATION),
    userType: z.enum(UserType)
  })