"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Parent, Student } from "../../../../../types";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import LinkStudentWithParent from "../../../forms/school/admins/link-student-with-parent";
import { ParentApiService } from "@/api/services/ParentApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import BackButton from "@/components/buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";
import ModalComponent from "@/components/modals/base/modal-component";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ParentDetails({ params }: { params: Record<string, any> }) {
  const [openLinkParentWithStudentForm, setOpenLinkParentWithStudentForm] = useState(false);

  const { data, isLoading, isError, error } = useCustomQuery(
    ["parentById"],
    () => ParentApiService.getParentByIdInSchool(params.parent_id),
    { id: params.parent_id },
  );

  const parentData: Parent = data?.parent !== undefined && data?.parent;

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Parent Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching parent details" />}

      {parentData && parentData !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2>Parent Details</h2>

              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell className="uppercase">{parentData?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Verified</TableHead>
                    <TableCell
                      className={`uppercase ${
                        parentData.is_verified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {parentData?.is_verified ? "Yes" : "No"}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableCell className="uppercase">{parentData?.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Name</TableHead>
                    <TableCell className="uppercase">{parentData?.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Middle Name</TableHead>
                    <TableCell className="uppercase">
                      {parentData?.middle_name || "not set"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Gender</TableHead>
                    <TableCell className="uppercase">{parentData?.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableCell>{parentData?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Phone</TableHead>
                    <TableCell className="uppercase">{parentData?.phone}</TableCell>
                  </TableRow>
                  <TableRow suppressHydrationWarning>
                    <Button onClick={() => setOpenLinkParentWithStudentForm(true)}>
                      Link Child
                    </Button>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="w-full space-y-3 rounded border p-4">
                <h2>Children Details</h2>

                <Table className="border">
                  <TableHeader>
                    <TableRow className="text-nowrap">
                      <TableHead>S/N</TableHead>
                      <TableHead>Admission Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Current Term Fee</TableHead>
                      <TableHead>Previous Debt</TableHead>
                      <TableHead>Outstanding Term Fee</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Enrolment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parentData?.children.map((student: Student, index) => {
                      return (
                        <TableRow key={student?._id} className="text-nowrap">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{student?.admission_number}</TableCell>

                          <TableCell className="capitalize">{`${TextHelper.capitalize(
                            student.first_name,
                          )} ${TextHelper.capitalize(student.last_name)}`}</TableCell>

                          <TableCell>{`${student.email}`}</TableCell>

                          <TableCell>{`${student?.current_class_level ?? "Pending"}`}</TableCell>
                          <TableCell>{`${
                            student?.latest_payment_document?.total_amount ?? "Unavailable yet"
                          }`}</TableCell>
                          <TableCell className="text-red-600">
                            ₦{`${student.outstanding_balance}`}
                          </TableCell>
                          <TableCell>{`${
                            student?.latest_payment_document?.remaining_amount ?? "Unavailable yet"
                          }`}</TableCell>
                          <TableCell className="capitalize">{`${TextHelper.capitalize(
                            student.gender,
                          )}`}</TableCell>
                          <TableCell
                            className={`${
                              student?.active_class_enrolment ? "text-green-600" : "text-yellow-600"
                            }`}
                          >{`${
                            student?.active_class_enrolment ? "Enrolled" : "Not enrolled"
                          }`}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {parentData?.children.length == 0 && (
                  <p className="bg-sidebar p-2 text-sm">No child linked yet</p>
                )}
              </div>
            </div>

            {/* Component for linking student with parent */}
            <ModalComponent
              open={openLinkParentWithStudentForm}
              onClose={() => setOpenLinkParentWithStudentForm(false)}
              className=""
            >
              <LinkStudentWithParent
                action_from="parent"
                parent_data={parentData}
                onClose={() => {
                  setOpenLinkParentWithStudentForm(false);
                }}
                closeOnSuccess={() => {
                  setOpenLinkParentWithStudentForm(false);
                }}
              />
            </ModalComponent>
          </div>
        </div>
      )}

      {isError && (
        <div className="bg-sidebar max-w-md space-y-3 rounded p-6 text-red-600">
          <p>{extractErrorMessage(error)}</p>
        </div>
      )}
    </div>
  );
}
