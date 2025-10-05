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
import { RequestNewVerificationSchema } from "@/api/schemas/AuthSchemas";
import SubmitButton from "@/components/buttons/SubmitButton";

export default function RequestOTP() {
  const { setShowNavModal } = useContext(GlobalContext);
  const router = useRouter();

  const form = useForm<z.infer<typeof RequestNewVerificationSchema>>({
    resolver: zodResolver(RequestNewVerificationSchema),
    defaultValues: {
      email: "",
    },
  });

  let { mutate: processNewEmailVerification, isPending: isProcessNewEmailVerification } =
    useCustomMutation(AuthApiService.authResendEmailVerification, {
      onSuccessCallback: () => {
        form.reset();
        setTimeout(() => {
          router.push("/email-verification");
        }, 3000);
        setShowNavModal(false);
      },
    });

  async function onSubmit(data: z.infer<typeof RequestNewVerificationSchema>) {
    processNewEmailVerification(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-4">
        <FormLabel className="mx-auto text-2xl font-medium sm:text-2xl">
          Request email verification
        </FormLabel>
        <InputComponent
          formControl={form.control}
          formName="email"
          formLabel="Email"
          formInputType="email"
          formPlaceholder="name@email.com"
          disabled={isProcessNewEmailVerification}
        />
        <SubmitButton
          disabled={!form.formState.isValid || isProcessNewEmailVerification}
          loading={isProcessNewEmailVerification}
          text="Send request"
          size="lg"
        />
        <FormDescription className="text-center">
          Already have token?{" "}
          <Link href="email-verification" className="hover:underline">
            Click here
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
