"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useContext, useState } from "react";
import { Parent, Student } from "../../../../../types";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { StudentApiService } from "@/api/services/StudentApiService";
import LinkStudentWithParent from "../../../forms/school/admins/link-student-with-parent";
import Image from "next/image";
import placeholder from "../../../../../public/images/placeholder.png";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import BackButton from "@/components/buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";
import ModalComponent from "@/components/modals/base/modal-component";
import AddFeeForStudent from "@/components/forms/school/admins/add-fee-for-student";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useRouter } from "next/navigation";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import toast from "react-hot-toast";
import { GlobalContext } from "@/providers/global-state-provider";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";

export default function StudentDetails({ params }: { params: Record<string, any> }) {
  const [openLinkStudentWithParentForm, setOpenLinkStudentWithParentForm] = useState(false);
  const [openAddFeeForm, setOpenAddFeeForm] = useState(false);
  const { setShowNavModal } = useContext(GlobalContext);
  const { userDetails } = useAuth();

  const queryClient = useQueryClient();
  const router = useRouter();

  let { data, isLoading, isError, error } = useCustomQuery(
    ["studentById"],
    () => StudentApiService.getStudentByIdInASchool(params.student_id),
    { id: params.student_id },
  );

  let studentData: Student = data?.student !== undefined && data?.student;

  let provisionAccountMutation = useCustomMutation(StudentApiService.provisionAccount, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["studentById", params.student_id] });
      setShowNavModal(false);
    },
    onErrorCallback: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Student Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching student details" />}

      {studentData && studentData !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto mb-4 h-24 w-24 sm:h-40 sm:w-40">
            <Image
              src={(studentData?.profile_image?.url as string) || placeholder}
              width={150}
              height={150}
              alt={studentData?.first_name + "image" || "Placeholder"}
              className="h-full w-full rounded object-center"
            />
          </div>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2 className="font-bold">Student Details</h2>

              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell className="uppercase">{studentData?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Admission Number</TableHead>
                    <TableCell className="uppercase">{studentData.admission_number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Verified</TableHead>
                    <TableCell
                      className={`uppercase ${
                        studentData.is_verified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {studentData?.is_verified ? "Yes" : "No"}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell
                      className={`uppercase ${
                        studentData.status ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {studentData?.status}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableCell className="uppercase">{studentData?.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableCell className="uppercase">{studentData?.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Name</TableHead>
                    <TableCell className="uppercase">{studentData?.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Middle Name</TableHead>
                    <TableCell className="uppercase">
                      {studentData?.middle_name || "not set"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Date of Birth</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(studentData?.dob as string)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Gender</TableHead>
                    <TableCell className="uppercase">{studentData?.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableCell>{studentData?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Phone</TableHead>
                    <TableCell className="uppercase">{studentData?.phone ?? "Not set"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableCell className="uppercase">
                      {studentData.home_address ?? "No address added."}
                    </TableCell>
                  </TableRow>

                  {(userDetails?.role === "super_admin" || userDetails?.role === "admin") && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <div className="flex flex-wrap gap-2 md:gap-4">
                          <Button onClick={() => setOpenLinkStudentWithParentForm(true)}>
                            Link Parent
                          </Button>
                          <Button
                            onClick={() => setOpenAddFeeForm(true)}
                            disabled={studentData?.latest_payment_document === null}
                          >
                            Add Fee
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="w-full space-y-2 rounded border p-4">
                <h2 className="font-bold">Account Details</h2>

                {studentData?.studentAccountDetails ? (
                  <Table className="border">
                    <TableBody>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Name</TableHead>
                        <TableCell className="uppercase">
                          {studentData?.studentAccountDetails?.account_name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Number</TableHead>
                        <TableCell className="uppercase">
                          {studentData?.studentAccountDetails?.account_number}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Balance</TableHead>
                        <TableCell className="uppercase">
                          {TextHelper.FormatAmount(
                            studentData?.studentAccountDetails?.account_balance,
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Reference</TableHead>
                        <TableCell className="uppercase">
                          {studentData?.studentAccountDetails?.customer_reference}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Creation Date</TableHead>
                        <TableCell className="uppercase">
                          {TextHelper.getFormattedDate(
                            studentData?.studentAccountDetails?.createdAt,
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="space-y-2">
                    <Separator />
                    <h1>Student has no account yet.</h1>

                    <SubmitButton
                      type="button"
                      loading={provisionAccountMutation.isPending}
                      disabled={provisionAccountMutation.isPending}
                      onSubmit={() => provisionAccountMutation.mutate(studentData?._id)}
                      text="Provision Account"
                    />
                  </div>
                )}
              </div>

              <div className="w-full space-y-2 rounded border p-4">
                <h2 className="font-bold">Fee Records</h2>

                <Table className="border">
                  <TableBody>
                    <TableRow>
                      <TableHead>Current Term Fee</TableHead>
                      <TableCell className="uppercase">
                        ₦
                        {` ${
                          studentData?.latest_payment_document?.total_amount ?? "Unavailable yet"
                        }`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Outstanding Term Fee</TableHead>
                      <TableCell className="uppercase">
                        ₦
                        {` ${
                          studentData?.latest_payment_document?.remaining_amount ??
                          "Unavailable yet"
                        }`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Previous Debt</TableHead>
                      <TableCell className="uppercase">
                        ₦{` ${studentData?.outstanding_balance}`}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="w-full space-y-2 rounded border p-4">
                <h2 className="font-bold">Parents Details</h2>

                <Table className="border">
                  <TableHeader>
                    <TableRow className="text-nowrap">
                      <TableHead>S/N</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>No. of Children</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData?.parent_id.map((parent: Parent, index) => {
                      return (
                        <TableRow key={parent?._id} className="text-nowrap">
                          <TableCell>{index + 1}</TableCell>

                          <TableCell className="capitalize">{`${TextHelper.capitalize(
                            parent.first_name,
                          )} ${TextHelper.capitalize(parent.last_name)}`}</TableCell>

                          <TableCell>{`${parent.email}`}</TableCell>

                          <TableCell className="capitalize">{`${parent.gender}`}</TableCell>

                          <TableCell>{`${parent.children.length}`}</TableCell>
                        </TableRow>
                      );
                    })}

                    {studentData?.parent_id.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>No parent linked yet</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="w-full space-y-2 rounded border p-4">
                <h3 className="font-bold">Academic Records</h3>

                <Table className="border">
                  <TableBody>
                    <TableRow>
                      <TableHead>Admission Session</TableHead>
                      <TableCell className="uppercase">{studentData?.admission_session}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Cummulative Score</TableHead>
                      <TableCell className="uppercase">
                        {studentData?.cumulative_score ?? "Not set"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Overal Position</TableHead>
                      <TableCell className="uppercase">
                        {studentData?.overall_position ?? "Not set"}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2}>
                        <Button
                          onClick={() => router.push(`${studentData?._id}/results`)}
                          type="button"
                        >
                          View Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {(userDetails?.role === "super_admin" || userDetails?.role === "admin") && (
              <>
                <ModalComponent
                  open={openLinkStudentWithParentForm}
                  onClose={() => setOpenLinkStudentWithParentForm(false)}
                >
                  <LinkStudentWithParent
                    action_from="student"
                    student_data={studentData}
                    onClose={() => {
                      setOpenLinkStudentWithParentForm(false);
                    }}
                    closeOnSuccess={() => {
                      setOpenLinkStudentWithParentForm(false);
                    }}
                  />
                </ModalComponent>

                <ModalComponent
                  open={openAddFeeForm}
                  onClose={() => setOpenAddFeeForm(false)}
                  className=""
                >
                  <AddFeeForStudent
                    student_id={studentData?._id}
                    onClose={() => {
                      setOpenAddFeeForm(false);
                    }}
                    closeOnSuccess={() => {
                      setOpenAddFeeForm(false);
                    }}
                  />
                </ModalComponent>
              </>
            )}
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
