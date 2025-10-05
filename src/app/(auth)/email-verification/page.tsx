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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import { useCallback, useContext, useEffect } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { useRouter } from "next/navigation";
import { AuthApiService } from "@/api/services/AuthApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { EmailVerificationFormSchema } from "@/api/schemas/AuthSchemas";
import SubmitButton from "@/components/buttons/SubmitButton";
import { extractErrorMessage } from "@/utils/extract-error-utils";

export default function EmailVerification() {
  const { setShowNavModal } = useContext(GlobalContext);

  const router = useRouter();

  const form = useForm<z.infer<typeof EmailVerificationFormSchema>>({
    resolver: zodResolver(EmailVerificationFormSchema),
    defaultValues: {
      token: "",
    },
  });

  const token = form.watch("token");

  let { mutate: verifyNewUser, isPending: isVerifyingUser } = useCustomMutation(
    AuthApiService.authVerifyEmail,
    {
      onSuccessCallback: () => {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        setShowNavModal(false);
        form.reset();
      },
      onErrorCallback: (error) => {
        if (
          extractErrorMessage(error) ===
          "Token does not exist or verification token has expired. You can request for another one"
        ) {
          setTimeout(() => {
            router.push("/request-email-verification");
          }, 2000);
        }
      },
    },
  );

  async function onSubmit(data: z.infer<typeof EmailVerificationFormSchema>) {
    verifyNewUser(data.token);
  }

  const handleAutoTriggerUserVerification = useCallback(
    (data: z.infer<typeof EmailVerificationFormSchema>) => {
      verifyNewUser(data.token);
    },
    [verifyNewUser],
  );

  useEffect(() => {
    if (token.length == 6) {
      setTimeout(
        form.handleSubmit(async (data: z.infer<typeof EmailVerificationFormSchema>) => {
          handleAutoTriggerUserVerification(data);
        }),
      );
    }
  }, [token, form, router, verifyNewUser, handleAutoTriggerUserVerification]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-4">
        <FormLabel className="mx-auto text-2xl font-medium sm:text-2xl">
          New account verification
        </FormLabel>

        <FormDescription className="text-center">
          Input your token recieved in your email
        </FormDescription>

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Verification token</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} disabled={isVerifyingUser} autoFocus>
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
                  Please enter the 6-digit token sent to your email to continue.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isValid && (
          <SubmitButton
            disabled={!form.formState.isValid || isVerifyingUser}
            loading={isVerifyingUser}
            text="Verify"
            size="lg"
          />
        )}
        <FormDescription className="text-center">
          <Link href="request-email-verification" className="hover:underline">
            Request new verification token
          </Link>
        </FormDescription>
        <FormDescription className="text-center">
          <Link href="login" className="hover:underline">
            Back to login
          </Link>
        </FormDescription>
      </form>
    </Form>
  );
}
