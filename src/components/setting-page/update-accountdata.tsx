"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import InputComponent from "../forms/base/input-component";
import { Form } from "../ui/form";
import ComponentLevelLoader from "../loaders/component-level-loader";

const AccountFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "Firstname is required",
  }),
  last_name: z.string().min(2, {
    message: "Lastname is required",
  }),
});

export function AccountDataUpdate({ endpoint }: { endpoint: string }) {
  const form = useForm<z.infer<typeof AccountFormSchema>>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  function onSubmit(data: z.infer<typeof AccountFormSchema>) {
    console.log(data);
  }

  return (
    <TabsContent value="account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <InputComponent
                formControl={form.control}
                formName="first_name"
                formLabel="First name"
                formInputType="text"
                formPlaceholder=""
                disabled={form.formState.isSubmitting}
              />

              <InputComponent
                formControl={form.control}
                formName="last_name"
                formLabel="Last name"
                formInputType="text"
                formPlaceholder=""
                disabled={form.formState.isSubmitting}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <ComponentLevelLoader
                    loading={form.formState.isSubmitting}
                    text="Saving changes"
                  />
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </TabsContent>
  );
}
