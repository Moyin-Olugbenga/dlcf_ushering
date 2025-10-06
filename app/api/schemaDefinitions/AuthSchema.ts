import z from "zod";

export const signInSchema = z.object({
  username: z.string(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." })
      .max(32, { message: "Password must be at most 32 characters long." })
      .refine((password: string) => /[A-Z]/.test(password), { message: "Password must contain at least one uppercase letter." })
      .refine((password: string) => /[a-z]/.test(password), { message: "Password must contain at least one lowercase letter." })
      .refine((password: string) => /[0-9]/.test(password), { message: "Password must contain at least one number." })
      .refine((password: string) => /[!@#$%^&*()-_+={[}]|:;"'<,>.?]/g.test(password), { message: "Password must contain at least one special character." }),
});


