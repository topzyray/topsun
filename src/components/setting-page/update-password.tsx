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

const UpdatePasswordFormSchema = z.object({
  old_password: z.string().min(2, {
    message: "Old password is required",
  }),
  new_password: z.string().min(2, {
    message: "New password is required",
  }),
});

export function PasswordUpdate({ endpoint }: { endpoint: string }) {
  const form = useForm<z.infer<typeof UpdatePasswordFormSchema>>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
    },
  });

  function onSubmit(data: z.infer<typeof UpdatePasswordFormSchema>) {
    console.log(data);
  }
  return (
    <TabsContent value="password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <InputComponent
                formControl={form.control}
                formName="old_password"
                formLabel="Old Password"
                formInputType="password"
                formPlaceholder="********"
                disabled={form.formState.isSubmitting}
                isPassword
              />
              <InputComponent
                formControl={form.control}
                formName="new_password"
                formLabel="New Password"
                formInputType="password"
                formPlaceholder="********"
                disabled={form.formState.isSubmitting}
                isPassword
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
                    text="Saving password"
                  />
                ) : (
                  "Save password"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </TabsContent>
  );
}
