"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import Link from "next/link";
import InputComponent from "@/components/forms/base/input-component";
import { LoginFormSchema } from "@/api/schemas/AuthSchemas";
import SubmitButton from "@/components/buttons/SubmitButton";
import { useLogin } from "@/api/hooks/auth/use-login.hook";

export default function Login() {
  const { loginUser, isLoggingIn } = useLogin();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    loginUser(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-4">
        <FormLabel className="mx-auto text-2xl font-medium sm:text-2xl">Welcome back</FormLabel>

        <InputComponent
          formControl={form.control}
          formName="email"
          formLabel="Email"
          formInputType="email"
          formPlaceholder="name@email.com"
          disabled={isLoggingIn}
        />

        <InputComponent
          formControl={form.control}
          formName="password"
          formLabel="Password"
          formInputType="password"
          formPlaceholder="**********"
          disabled={isLoggingIn}
          isPassword
        />

        <Link href="forgot-password" className="w-max">
          <FormDescription className="text-lg hover:underline">Forgot password?</FormDescription>
        </Link>

        <SubmitButton
          disabled={!form.formState.isValid || isLoggingIn}
          loading={isLoggingIn}
          text="Login"
          size="lg"
        />
        <FormDescription className="text-center">
          Didn&apos;t receive email verification{" "}
          <Link
            href="request-email-verification"
            className="cursor-pointer text-green-600 hover:underline"
          >
            Click here
          </Link>
        </FormDescription>
      </form>
    </Form>
  );
}
