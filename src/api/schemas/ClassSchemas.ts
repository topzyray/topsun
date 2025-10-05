import { z } from "zod";

export const AddNewClassFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(5, {
    message: "Description is required",
  }),
  level: z.string().min(1, {
    message: "Level is required",
  }),
  section: z
    .string()
    .min(1, {
      message: "Section is required",
    })
    .max(1, {
      message: "Section item cannot exeed 1 character",
    }),
  compulsory_subjects: z.array(z.string()).min(5, {
    message: "Subjects are required",
  }),
});
