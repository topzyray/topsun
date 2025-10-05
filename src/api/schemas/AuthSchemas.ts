import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid or empty email" }),
  password: z.string().min(2, {
    message: "Password is required",
  }),
});

export const RequestNewVerificationSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Enter valid email",
  }),
});

export const EmailVerificationFormSchema = z.object({
  token: z
    .string()
    .min(6, {
      message: "OTP is required",
    })
    .regex(/^\d{6}$/, {
      message: "OTP must consist of exactly 6 digits",
    }),
});

export const ResetPasswordFormSchema = z
  .object({
    token: z
      .string()
      .min(6, {
        message: "OTP is required",
      })
      .regex(/^\d{6}$/, {
        message: "OTP must consist of exactly 6 digits",
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
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
