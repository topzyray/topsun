"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import SelectComponent from "@/components/forms/base/select-component";
import InputComponent from "@/components/forms/base/input-component";
import { AuthApiService } from "@/api/services/AuthApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { TeacherRegistrationFormSchema } from "@/api/schemas/UserSchemas";
import { GenderTypeEnum } from "@/api/enums/GenderTypeEnum";
import { RoleTypeEnum } from "@/api/enums/RoleTypeEnum";
import SubmitButton from "@/components/buttons/SubmitButton";
import { useRouter } from "next/navigation";
import { DataHelper } from "@/helpers/DataHelper";

export default function TeacherRegistrationForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof TeacherRegistrationFormSchema>>({
    resolver: zodResolver(TeacherRegistrationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      gender: "",
      phone: "",
      dob: undefined,
      employment_date: undefined,
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { mutate: registerTeacher, isPending: isRegisteringTeacher } = useCustomMutation(
    AuthApiService.authRegister,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        form.reset();
        setTimeout(() => {
          router.back();
        }, 2000);
      },
    },
  );

  async function onSubmit(data: z.infer<typeof TeacherRegistrationFormSchema>) {
    registerTeacher({ ...data, role: RoleTypeEnum.TEACHER });
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mt-4 mb-14">
        <Form {...form}>
          <h1 className="mb-6 text-xl uppercase">Teacher Account Creation</h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="grid w-full grid-cols-1 place-content-end gap-x-4 gap-y-4 md:grid-cols-2 md:gap-y-6">
              <InputComponent
                formControl={form.control}
                formName="first_name"
                formLabel="First name"
                formInputType="text"
                formPlaceholder=""
                disabled={isRegisteringTeacher}
              />

              <InputComponent
                formControl={form.control}
                formName="last_name"
                formLabel="Last name"
                formInputType="text"
                formPlaceholder=""
                disabled={isRegisteringTeacher}
              />

              <InputComponent
                formControl={form.control}
                formName="middle_name"
                formLabel="Middle name"
                formInputType="text"
                formPlaceholder=""
                disabled={isRegisteringTeacher}
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
                disabled={isRegisteringTeacher}
              />

              <InputComponent
                formControl={form.control}
                formName="phone"
                formLabel="Phone"
                formInputType="text"
                formPlaceholder=""
                disabled={isRegisteringTeacher}
              />

              <InputComponent
                formControl={form.control}
                formName="dob"
                formLabel="Date of birth"
                formInputType="date"
                formMaxYear={DataHelper.minAge(18)}
                disabled={isRegisteringTeacher}
              />

              <InputComponent
                formControl={form.control}
                formName="employment_date"
                formLabel="Date of employment"
                formInputType="date"
                formMaxYear={DataHelper.minAge(0)}
                disabled={isRegisteringTeacher}
              />

              <InputComponent
                formControl={form.control}
                formName="email"
                formLabel="Email"
                formInputType="email"
                formPlaceholder=""
                disabled={isRegisteringTeacher}
              />

              <InputComponent
                formControl={form.control}
                formName="password"
                formLabel="Password"
                formInputType="password"
                formPlaceholder=""
                disabled={isRegisteringTeacher}
                isPassword
              />

              <InputComponent
                formControl={form.control}
                formName="confirm_password"
                formLabel="Confirm Password"
                formInputType="password"
                formPlaceholder=""
                disabled={isRegisteringTeacher}
                isPassword
              />
            </div>

            <SubmitButton
              disabled={!form.formState.isValid || isRegisteringTeacher}
              loading={isRegisteringTeacher}
              text="Create"
              className="mt-6 md:mt-8"
            />
          </form>
        </Form>
      </div>
    </section>
  );
}
