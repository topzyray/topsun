"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";
import { SuperAdminApiService } from "@/api/services/SuperAdminApiService";
import { ScrollArea } from "@/components/ui/scroll-area";
import CancelButton from "@/components/buttons/CancelButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InputComponent from "../../base/input-component";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface AddPaymentPriorityForSchoolForm {
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}

const formSchema = z.object({
  priority_order: z.array(
    z.object({
      fee_name: z.string().min(1),
      priority_number: z.coerce.number().min(1),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddPaymentPriorityForSchoolForm({
  open,
  onClose,
  closeOnSuccess,
}: AddPaymentPriorityForSchoolForm) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority_order: [{ fee_name: "", priority_number: 1 }],
    },
  });

  const {
    fields: priorityFields,
    append: appendPriority,
    remove: removePriority,
  } = useFieldArray({
    name: "priority_order",
    control: form.control,
  });

  const { mutate: createPaymentPriority, isPending: isCreatingPaymentPriority } = useCustomMutation(
    SuperAdminApiService.createPaymentPriority,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    createPaymentPriority({
      requestBody: data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <ScrollArea className="h-full max-h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="uppercase">Payment Priority Order Form</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>

              <Separator />

              <Card className="rounded bg-transparent p-2">
                <Accordion type="multiple" className="w-full space-y-2">
                  {priorityFields.map((field, index) => (
                    <div key={field.id} className="border px-2">
                      <AccordionItem value={`q-${index}`}>
                        <AccordionTrigger className="lg:text-lg">Item {index + 1}</AccordionTrigger>
                        <AccordionContent className="bg-sidebar mb-4 rounded-lg p-4">
                          <div className="space-y-3">
                            <InputComponent
                              formName={`priority_order.${index}.priority_number`}
                              formControl={form.control}
                              formLabel="Priority Number"
                              formPlaceholder=""
                              disabled={isCreatingPaymentPriority}
                              formInputType="number"
                              inputClassName="py-2"
                            />

                            <InputComponent
                              formName={`priority_order.${index}.fee_name`}
                              formControl={form.control}
                              formLabel="Fee Name"
                              formPlaceholder=""
                              disabled={isCreatingPaymentPriority}
                              formInputType="text"
                              inputClassName="py-2"
                            />

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removePriority(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>

                <div className="flex justify-center gap-x-4">
                  <Button
                    type="button"
                    onClick={() => appendPriority({ priority_number: 0, fee_name: "" })}
                    disabled={isCreatingPaymentPriority}
                  >
                    Add Payment Priority
                  </Button>
                </div>
              </Card>

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
                  loading={isCreatingPaymentPriority}
                  type="submit"
                  disabled={isCreatingPaymentPriority}
                />
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
