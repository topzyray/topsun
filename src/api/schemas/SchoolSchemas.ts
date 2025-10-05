import { z } from "zod";

export const EnrollSchoolSchema = z.object({
  school_name: z.string().min(1, "School name is required"),
  subdomain: z.string().min(1, "School sub-domain is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email({ message: "Invalid or empty email" }),
  website: z.string().optional(),
});

export const UploadSchoolLogoSchema = z.object({
  logo: z
    .instanceof(File, { message: "A file is required." })
    .refine((file) => file.size > 0, { message: "File is required." })
    .optional(),
});

export const UploadSchoolImageSchema = z.object({
  school_image: z
    .instanceof(File, { message: "A file is required." })
    .refine((file) => file.size > 0, { message: "File is required." })
    .optional(),
});

export const SchoolOwnerRegistrationFormSchema = z
  .object({
    first_name: z.string().min(2, {
      message: "First name is required",
    }),
    last_name: z.string().min(2, {
      message: "Last name is required",
    }),
    middle_name: z.string().optional(),
    gender: z.string().min(2, {
      message: "Gender is required",
    }),
    phone: z.string().min(8, {
      message: "Phone number is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)",
      ),
    confirm_password: z.string().min(8, "Confirm password must be at least 8 characters long"),
    school: z.string().min(2, {
      message: "Role is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
