"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputComponent from "@/components/forms/base/input-component";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import { useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { AuthApiService } from "@/api/services/AuthApiService";
import { useRouter } from "next/navigation";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { ResetPasswordFormSchema } from "@/api/schemas/AuthSchemas";
import SubmitButton from "@/components/buttons/SubmitButton";

export default function ResetPassword() {
  const { setShowNavModal } = useContext(GlobalContext);

  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      token: "",
      password: "",
      confirm_password: "",
    },
  });

  const token = form.watch("token");

  let { mutate: processResetPassword, isPending: isProcessingResetPassword } = useCustomMutation(
    AuthApiService.authResetPassword,
    {
      onSuccessCallback: () => {
        form.reset();
        router.push("/login");
        setShowNavModal(false);
      },
    },
  );

  async function onSubmit(data: z.infer<typeof ResetPasswordFormSchema>) {
    processResetPassword(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-4">
        <FormLabel className="mx-auto text-2xl font-medium sm:text-2xl">Reset Password</FormLabel>

        <FormDescription className="text-center">
          Input your token and new password below.
        </FormDescription>

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} disabled={form.formState.isSubmitting} autoFocus>
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={0} className="w-1/6" />
                    <InputOTPSlot index={1} className="w-1/6" />
                    <InputOTPSlot index={2} className="w-1/6" />
                    <InputOTPSlot index={3} className="w-1/6" />
                    <InputOTPSlot index={4} className="w-1/6" />
                    <InputOTPSlot index={5} className="w-1/6" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              {token.length < 6 && (
                <FormDescription>
                  Please enter the one-time password sent to your email to continue.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        {token.length == 6 && (
          <>
            <InputComponent
              formControl={form.control}
              formName="password"
              formLabel="New Password"
              formInputType="password"
              formPlaceholder="**********"
              disabled={isProcessingResetPassword}
              isPassword
            />
            <InputComponent
              formControl={form.control}
              formName="confirm_password"
              formLabel="Confirm Password"
              formInputType="password"
              formPlaceholder="**********"
              disabled={isProcessingResetPassword}
              isPassword
            />

            <SubmitButton
              disabled={!form.formState.isValid || isProcessingResetPassword}
              loading={isProcessingResetPassword}
              text="Submit request"
              size="lg"
            />
          </>
        )}
        <FormDescription className="text-center">
          <Link href="login" className="hover:underline">
            Back to login
          </Link>
        </FormDescription>
      </form>
    </Form>
  );
}
