"use client";

import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import SelectComponent from "@/components/forms/base/select-component";
import SchoolAdminRegistration from "@/components/forms/school/admins/registrations/admin";
import { Separator } from "@/components/ui/separator";
import TeacherRegistration from "@/components/forms/school/admins/registrations/teacher";
import StudentRegistration from "@/components/forms/school/admins/registrations/student";
import ParentRegistration from "@/components/forms/school/admins/registrations/parent";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { DataOptionOne } from "../../../../../types";
import BackButton from "@/components/buttons/BackButton";

interface AccountCreationComponent {
  userRegistrableData: DataOptionOne[];
}

export default function AccountCreationComponent({
  userRegistrableData,
}: AccountCreationComponent) {
  const { userDetails } = useAuth();
  const form = useForm({
    defaultValues: {
      role: "",
    },
  });

  const userOption = form.watch("role");

  return (
    <section>
      <Form {...form}>
        <div className="">
          {userOption == "" && (
            <div className="">
              <div className="mb-4">
                <BackButton />
              </div>

              <Separator />

              <div className="py-4">
                <h1 className="text-xl uppercase">User Account Creation</h1>
              </div>

              <Separator />
              <div className="mx-auto mt-4 max-w-5xl">
                <SelectComponent
                  formControl={form.control}
                  formName="role"
                  formLabel="Account Type"
                  formPlaceholder="Select user to create"
                  formOptionLabel="Role"
                  formOptionData={userRegistrableData}
                  disabled={form.formState.isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="w-full">
            {userOption != "" && (
              <>
                <div className="mb-4">
                  <BackButton onClick={() => form.reset()} />
                </div>
                <Separator />
              </>
            )}

            {userOption === "admin" && userDetails?.role === "super_admin" && (
              <SchoolAdminRegistration />
            )}

            {userOption === "teacher" && <TeacherRegistration />}

            {userOption === "student" && <StudentRegistration />}

            {userOption === "parent" && <ParentRegistration />}
          </div>
        </div>
      </Form>
    </section>
  );
}
