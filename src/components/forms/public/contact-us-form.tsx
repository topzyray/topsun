"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { ContactUsApiService } from "@/api/services/ContactUsApiService";
import InputComponent from "../base/input-component";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ContactUsFormSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last name is required",
  }),
  school_name: z.string().optional(),
  email: z.string().email(),
  message: z.string().min(1, {
    message: "Message is required",
  }),
});

export default function ContactUsForm() {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ContactUsFormSchema>>({
    resolver: zodResolver(ContactUsFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      school_name: "",
      email: "",
      message: "",
    },
  });

  let { mutate: createContactUs, isPending: isCreatingContactUs } = useCustomMutation(
    ContactUsApiService.createContactUs,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["contact_us"] });
        form.reset();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof ContactUsFormSchema>) {
    createContactUs(data);
  }

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <h1 className="text-xl font-semibold">Contact Form</h1>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="space-y-4">
                <InputComponent
                  formControl={form.control}
                  formName="first_name"
                  formLabel="First name"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isCreatingContactUs}
                />

                <InputComponent
                  formControl={form.control}
                  formName="last_name"
                  formLabel="Last name"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isCreatingContactUs}
                />

                <InputComponent
                  formControl={form.control}
                  formName="school_name"
                  formLabel="School Name (optional)"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isCreatingContactUs}
                />

                <InputComponent
                  formControl={form.control}
                  formName="email"
                  formLabel="Email"
                  formInputType="email"
                  formPlaceholder=""
                  disabled={isCreatingContactUs}
                />

                <InputComponent
                  formControl={form.control}
                  formName="message"
                  formLabel="Message"
                  formInputType="message"
                  formPlaceholder=""
                  disabled={isCreatingContactUs}
                />
              </div>

              <SubmitButton
                disabled={!form.formState.isValid || isCreatingContactUs}
                loading={isCreatingContactUs}
                className="mt-6 md:mt-8"
              />
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
