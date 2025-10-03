import { z } from "zod";

export class Utility {
    public static async zodValidate(schema: z.ZodSchema<unknown>){
        return (values: unknown) => {
            const result = schema.safeParse(values);
            if (!result.success) {
                const errors: Record<string, string> = {};
                result.error.issues.forEach((e) => {
                    if (e.path.length > 0) {
                    errors[e.path[0] as string] = e.message;
                    }
                });
                return errors;
            }
            return {};
        };
    }
}