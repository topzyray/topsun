"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import CancelButton from "@/components/buttons/CancelButton";
import { Separator } from "@/components/ui/separator";
import { SchoolAccountsApiService } from "@/api/services/SchoolAccountsApiService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddSchoolAccountForm {
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}

const formSchema = z.object({
  account_details_array: z.array(
    z.object({
      account_name: z.string().min(1),
      account_number: z.string().min(1),
      bank_name: z.string().min(1),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddSchoolAccountForm({
  open,
  onClose,
  closeOnSuccess,
}: AddSchoolAccountForm) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_details_array: [
        {
          account_name: "",
          bank_name: "",
          account_number: "",
        },
      ],
    },
  });

  const {
    fields: accountDetailsArrayFields,
    append: appendAccount,
    remove: removeAccount,
  } = useFieldArray({
    name: "account_details_array",
    control: form.control,
  });

  let { mutate: addSchoolAccount, isPending: isAddingNewAccount } = useCustomMutation(
    SchoolAccountsApiService.createSchoolAccount,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["school_accounts"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    addSchoolAccount(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <ScrollArea className="h-full max-h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="uppercase">Create School Accounts Form</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>

              <Separator />

              {accountDetailsArrayFields.map((field, index) => (
                <div key={field.id} className="flex w-full flex-col flex-wrap gap-4">
                  <FormField
                    control={form.control}
                    name={`account_details_array.${index}.account_number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" disabled={isAddingNewAccount} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`account_details_array.${index}.account_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" disabled={isAddingNewAccount} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`account_details_array.${index}.bank_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" disabled={isAddingNewAccount} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeAccount(index)}
                  >
                    Remove
                  </Button>
                  <Separator />
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendAccount({
                    account_number: "",
                    account_name: "",
                    bank_name: "",
                  })
                }
                disabled={isAddingNewAccount}
              >
                Add
              </Button>

              <DialogFooter>
                <DialogClose asChild>
                  <CancelButton
                    onClose={() => {
                      form.reset();
                      onClose();
                    }}
                  />
                </DialogClose>

                <SubmitButton
                  loading={isAddingNewAccount}
                  type="submit"
                  disabled={isAddingNewAccount}
                />
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
