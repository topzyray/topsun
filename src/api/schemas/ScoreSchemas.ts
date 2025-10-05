import * as z from "zod";

const scoreValueSchema = z
  .union([z.string(), z.number()])
  .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), {
    message: "Score must be between 0 and 100",
  })
  .optional();

export const ScoreSchema = z.object({
  scoreName: z.string().optional(),
  students: z.array(
    z
      .object({
        student_id: z.string(),
      })
      .catchall(scoreValueSchema), // This allows dynamic score fields
  ),
});
