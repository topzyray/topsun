import { z } from "zod";

export const AdminRegistrationFormSchema = z
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
    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .transform((val) => new Date(val)),
    employment_date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .transform((val) => new Date(val)),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(2, {
      message: "Password is required",
    }),
    confirm_password: z.string().min(2, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password and confirm password must match",
    path: ["confirm_password", "password"],
  });

export const StudentRegistrationFormSchema = z
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
    admission_number: z.string().min(2, {
      message: "Admission number is required",
    }),
    admission_session: z.string().min(9, {
      message: "Session is required",
    }),
    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .transform((val) => new Date(val)),
    phone: z.string().min(10, {
      message: "Email is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(2, {
      message: "Password is required",
    }),
    confirm_password: z.string().min(2, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password and confirm password must match",
    path: ["confirm_password", "password"],
  });

export const TeacherRegistrationFormSchema = z
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
    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .transform((val) => new Date(val)),
    employment_date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .transform((val) => new Date(val)),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(2, {
      message: "Password is required",
    }),
    confirm_password: z.string().min(2, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password and confirm password must match",
    path: ["confirm_password", "password"],
  });

export const ParentRegistrationFormSchema = z
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
    password: z.string().min(2, {
      message: "Password is required",
    }),
    confirm_password: z.string().min(2, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password and confirm password must match",
    path: ["confirm_password", "password"],
  });

export const NonTeachingRegistrationFormSchema = z
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
    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .transform((val) => new Date(val)),
    employment_date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .transform((val) => new Date(val)),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(2, {
      message: "Password is required",
    }),
    confirm_password: z.string().min(2, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password and confirm password must match",
    path: ["confirm_password", "password"],
  });
