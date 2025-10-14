"use client";

import { PaymentApiService } from "@/api/services/PaymentApiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormDescription, FormLabel } from "../../ui/form";
import InputComponent from "../base/input-component";
import { Student } from "../../../../types";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { CircularLoader } from "../../loaders/page-level-loader";
import { StudentApiService } from "@/api/services/StudentApiService";
import { ComboboxComponent } from "../base/combo-box-component";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { TextHelper } from "@/helpers/TextHelper";
import ErrorBox from "@/components/atoms/error-box";
import SubmitButton from "@/components/buttons/SubmitButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CashPaymentFormSchema = z.object({
  amount_paying: z.string().min(1, {
    message: "Amount paid is required",
  }),
  admission_number: z.string().min(1, {
    message: "Field is required",
  }),
  full_name: z.string().min(1, {
    message: "Field is required",
  }),
  email: z.string().min(1, {
    message: "Field is required",
  }),
});

export default function PaymentFormCash() {
  const queryClient = useQueryClient();
  const { activeSessionData } = useContext(GlobalContext);
  const [classStudentData, setClassStudentData] = useState({
    class_id: "",
    student_id: "",
  });
  const [studentPayment, setStudentPayment] = useState({
    current_debt: 0,
    remaining_fee: 0,
    total_amount_payable: 0,
    current_term_fee: 0,
  });

  const {
    data,
    isLoading: isLoadingStudentData,
    isError: isStudentError,
    error: studentError,
  } = useCustomQuery(["students"], StudentApiService.getAllStudentInASchool);

  const studentData: Student[] =
    data?.students?.studentObj !== undefined && data?.students?.studentObj;

  const form = useForm<z.infer<typeof CashPaymentFormSchema>>({
    resolver: zodResolver(CashPaymentFormSchema),
    defaultValues: {
      amount_paying: "",
      admission_number: "",
      email: "",
      full_name: "",
    },
  });

  const admission_number_data = form.watch("admission_number");

  useEffect(() => {
    if (admission_number_data) {
      studentData.length > 0 &&
        studentData.forEach((student: Student) => {
          if (student.admission_number === admission_number_data) {
            form.setValue("email", student.email);
            form.setValue(
              "full_name",
              `${TextHelper.capitalize(
                student.first_name,
              )} ${TextHelper.capitalize(student.last_name)}`,
            );

            setStudentPayment((prev) => ({
              ...prev,
              current_debt: student?.outstanding_balance,
              remaining_fee: student?.latest_payment_document?.remaining_amount,
              total_amount_payable:
                student?.outstanding_balance + student?.latest_payment_document?.remaining_amount,
              current_term_fee: student?.latest_payment_document?.total_amount,
            }));

            setClassStudentData((prev) => ({
              ...prev,
              class_id: student?.current_class?.class_id,
              student_id: student?._id,
            }));
          }
        });
    }
  }, [admission_number_data, form, studentData]);

  const amount_paying_data = form.watch("amount_paying");

  const { mutate: makeCashPayment, isPending: isMakingCashPayment } = useCustomMutation(
    PaymentApiService.makeCashPayment,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["paymentById"] });
        form.reset();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof CashPaymentFormSchema>) {
    const processed_data = {
      formData: {
        amount_paying: Number(data.amount_paying),
        payment_method: "cash",
        term: activeSessionData?.activeTerm?.name as string,
        class_id: classStudentData?.class_id,
      },
      params: {
        session_id: activeSessionData?.activeSession?._id as string,
        student_id: classStudentData?.student_id,
      },
    };
    makeCashPayment(processed_data);
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-5xl">
      {activeSessionData.loading || isLoadingStudentData ? (
        <CircularLoader text="Loading form data" />
      ) : activeSessionData.activeSession && activeSessionData.activeTerm && studentData.length ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 px-4 py-6 sm:border"
          >
            <FormLabel className="text-center text-lg uppercase">Cash payment form</FormLabel>

            <FormDescription className="text-green-600">
              Note: This is for students paying with cash.
            </FormDescription>

            <ComboboxComponent
              formName="admission_number"
              formControl={form.control}
              formLabel="Student Admission Number"
              formOptionLabel="Select Admission No."
              formOptionData={studentData}
              formPlaceholder=""
              displayValue={(data) =>
                `${data.admission_number} - ${TextHelper.capitalize(
                  data.first_name,
                )} ${TextHelper.capitalize(data.last_name)}`
              }
              valueField="admission_number"
              disabled={isMakingCashPayment}
            />

            <InputComponent
              formName="email"
              formControl={form.control}
              formLabel="Student Email"
              formPlaceholder=""
              formInputType="text"
              disabled={isMakingCashPayment}
              readOnly={true}
            />

            <InputComponent
              formName="full_name"
              formControl={form.control}
              formLabel="Student Name"
              formPlaceholder=""
              formInputType="text"
              disabled={isMakingCashPayment}
              readOnly={true}
            />

            <div className="rounded border px-2.5 py-1.5">
              {admission_number_data && studentPayment.total_amount_payable > 0 ? (
                <Table className="max-w-xs border">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Current Term Fee</TableCell>
                      <TableCell className="text-red-600">
                        ₦ {studentPayment?.current_term_fee}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Previous Debt</TableCell>
                      <TableCell className="text-red-600">
                        ₦ {studentPayment?.current_debt}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Current Term Remaining</TableCell>
                      <TableCell className="text-red-600">
                        ₦{studentPayment?.remaining_fee}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Amount Payable</TableCell>
                      <TableCell className="text-red-600">
                        ₦{studentPayment?.total_amount_payable}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : admission_number_data && !studentPayment?.total_amount_payable ? (
                <FormDescription>
                  Student has no payment document or not enrolled yet.
                </FormDescription>
              ) : (
                <FormDescription>No student selected yet.</FormDescription>
              )}
            </div>

            <InputComponent
              formName="amount_paying"
              formControl={form.control}
              formLabel="Amount"
              formPlaceholder="Enter Amount"
              disabled={
                isMakingCashPayment ||
                studentPayment.total_amount_payable <= 0 ||
                !studentPayment.total_amount_payable
              }
              formInputType="text"
            />

            <div className="flex justify-start">
              <SubmitButton
                disabled={
                  !form.formState.isValid ||
                  isMakingCashPayment ||
                  studentPayment.total_amount_payable <= 0 ||
                  +amount_paying_data > studentPayment.total_amount_payable ||
                  !studentPayment.total_amount_payable
                }
                loading={isMakingCashPayment}
              />
            </div>
          </form>
        </Form>
      ) : !activeSessionData.activeSession || !activeSessionData.activeTerm || isStudentError ? (
        <div className="text-red-600">
          <ErrorBox error={studentError} />
          <ErrorBox message="Error loading active session data" />
        </div>
      ) : (
        <ErrorBox message="No payment form found. Please reload page." />
      )}
    </div>
  );
}
