"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import SelectComponent from "@/components/forms/base/select-component";
import InputComponent from "@/components/forms/base/input-component";
import { AuthApiService } from "@/api/services/AuthApiService";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { CircularLoader } from "../../../../loaders/page-level-loader";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { StudentRegistrationFormSchema } from "@/api/schemas/UserSchemas";
import { GenderTypeEnum } from "@/api/enums/GenderTypeEnum";
import { RoleTypeEnum } from "@/api/enums/RoleTypeEnum";
import SubmitButton from "@/components/buttons/SubmitButton";
import { useRouter } from "next/navigation";

export default function StudentRegistrationForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { activeSessionData } = useContext(GlobalContext);

  const form = useForm<z.infer<typeof StudentRegistrationFormSchema>>({
    resolver: zodResolver(StudentRegistrationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      gender: "",
      admission_number: "",
      admission_session: "",
      dob: undefined,
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { mutate: registerStudent, isPending: isRegisteringStudent } = useCustomMutation(
    AuthApiService.authRegister,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
        form.reset();
        setTimeout(() => {
          router.back();
        }, 2000);
      },
    },
  );

  async function onSubmit(data: z.infer<typeof StudentRegistrationFormSchema>) {
    registerStudent({ ...data, role: RoleTypeEnum.STUDENT });
  }

  useEffect(() => {
    if (activeSessionData?.activeSession?.academic_session) {
      form.setValue("admission_session", activeSessionData.activeSession.academic_session);
    }
  }, [activeSessionData?.activeSession?.academic_session, form]);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mt-4 mb-14">
        {activeSessionData.loading ? (
          <CircularLoader text="Loading student registration form" />
        ) : (
          <Form {...form}>
            <h1 className="mb-6 text-xl uppercase">Student Account Creation</h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="grid w-full grid-cols-1 place-content-end gap-x-4 gap-y-4 md:grid-cols-2 md:gap-y-6">
                <InputComponent
                  formControl={form.control}
                  formName="first_name"
                  formLabel="First Name"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isRegisteringStudent}
                />

                <InputComponent
                  formControl={form.control}
                  formName="last_name"
                  formLabel="Last Name"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isRegisteringStudent}
                />

                <InputComponent
                  formControl={form.control}
                  formName="middle_name"
                  formLabel="Middle Name"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isRegisteringStudent}
                />

                <SelectComponent
                  formControl={form.control}
                  formName="gender"
                  formLabel="Gender"
                  formPlaceholder="Select gender"
                  formOptionLabel="Gender"
                  formOptionData={[
                    { label: GenderTypeEnum.MALE, value: GenderTypeEnum.MALE },
                    {
                      label: GenderTypeEnum.FEMALE,
                      value: GenderTypeEnum.FEMALE,
                    },
                    {
                      label: GenderTypeEnum.OTHERS,
                      value: GenderTypeEnum.OTHERS,
                    },
                  ]}
                  disabled={isRegisteringStudent}
                />

                <InputComponent
                  formControl={form.control}
                  formName="admission_number"
                  formLabel="Admission Number"
                  formInputType="text"
                  disabled={isRegisteringStudent}
                />

                <InputComponent
                  formControl={form.control}
                  formName="admission_session"
                  formLabel="Admission Session"
                  formPlaceholder=""
                  formInputType="text"
                  disabled={isRegisteringStudent}
                  editable={true}
                />

                <InputComponent
                  formControl={form.control}
                  formName="dob"
                  formLabel="Date of Birth"
                  formInputType="date"
                  // formMaxYear={minAge(9)}
                  disabled={isRegisteringStudent}
                />

                <InputComponent
                  formControl={form.control}
                  formName="phone"
                  formLabel="Phone Number"
                  formInputType="phone"
                  disabled={isRegisteringStudent}
                />

                <InputComponent
                  formControl={form.control}
                  formName="email"
                  formLabel="Email"
                  formInputType="email"
                  formPlaceholder=""
                  disabled={isRegisteringStudent}
                />

                <InputComponent
                  formControl={form.control}
                  formName="password"
                  formLabel="Password"
                  formInputType="password"
                  formPlaceholder=""
                  disabled={isRegisteringStudent}
                  isPassword
                />

                <InputComponent
                  formControl={form.control}
                  formName="confirm_password"
                  formLabel="Confirm Password"
                  formInputType="password"
                  formPlaceholder=""
                  disabled={isRegisteringStudent}
                  isPassword
                />
              </div>

              <SubmitButton
                disabled={!form.formState.isValid || isRegisteringStudent}
                loading={isRegisteringStudent}
                text="Create"
                className="mt-6 md:mt-8"
              />
            </form>
          </Form>
        )}
      </div>
    </section>
  );
}
