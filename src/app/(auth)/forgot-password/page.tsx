"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import Link from "next/link";
import { useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import InputComponent from "@/components/forms/base/input-component";
import { AuthApiService } from "@/api/services/AuthApiService";
import { useRouter } from "next/navigation";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { ForgotPasswordFormSchema } from "@/api/schemas/AuthSchemas";
import SubmitButton from "@/components/buttons/SubmitButton";

export default function ForgotPassword() {
  const { setShowNavModal } = useContext(GlobalContext);
  const router = useRouter();

  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  let { mutate: processForgotPassword, isPending: isProcessingForgotPassword } = useCustomMutation(
    AuthApiService.authForgotPassword,
    {
      onSuccessCallback: () => {
        router.push("/reset-password");
        setShowNavModal(false);
        form.reset();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof ForgotPasswordFormSchema>) {
    processForgotPassword(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-4">
        <FormLabel className="mx-auto text-2xl font-medium sm:text-2xl">
          Forgot your password?
        </FormLabel>

        <FormDescription className="text-center">
          Don&apos;t panic, use the form below to reset it.
        </FormDescription>

        <InputComponent
          formControl={form.control}
          formName="email"
          formLabel="Email"
          formInputType="email"
          formPlaceholder="name@email.com"
          disabled={isProcessingForgotPassword}
        />

        <SubmitButton
          disabled={!form.formState.isValid || isProcessingForgotPassword}
          loading={isProcessingForgotPassword}
          text="Send request"
          size="lg"
        />

        <FormDescription className="text-center">
          <Link href="login" className="hover:underline">
            Back to login
          </Link>
        </FormDescription>
      </form>
    </Form>
  );
}
