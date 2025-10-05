import { z } from "zod";

export const AddSessionFormSchema = z.object({
  academic_session: z.string().min(6, {
    message: "Session is required",
  }),
});
