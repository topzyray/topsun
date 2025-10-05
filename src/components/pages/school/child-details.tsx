"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import Image from "next/image";
import placeholder from "../../../../public/images/placeholder.png";
import { Student } from "../../../../types";
import { ParentApiService } from "@/api/services/ParentApiService";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import NewSessionSubscription from "../../modals/new-session-subscription";
import BackButton from "../../buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export default function ChildDetails({ params }: { params: Record<string, string> }) {
  const [showNewSubscription, setShowNewSessionSubscription] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError, error } = useCustomQuery(
    ["studentById"],
    () => ParentApiService.fetchLinkedStudentSchool(params.child_id),
    { id: params.child_id },
  );

  const childData: Student = data?.student !== undefined && data?.student;

  let status_color;

  switch (childData?.status) {
    case "active":
      status_color = "text-green-600";
      break;
    case "inactive":
      status_color = "text-gray-600";
      break;
    case "sacked":
      status_color = "text-red-600";
      break;
    case "resigned":
      status_color = "text-yellow-600";
      break;
    default:
      status_color = "";
      break;
  }

  useEffect(() => {
    if (
      childData &&
      childData.role === "student" &&
      childData.new_session_subscription === null &&
      childData.active_class_enrolment === false
    ) {
      setShowNewSessionSubscription(true);
    }
  }, [childData]);

  // useEffect(() => {
  //   if (childData?.latest_payment_document?.is_submit_response === false) {
  //     setShowBusSubscriptionAlert(true);
  //   }
  // }, [childData?.latest_payment_document?.is_submit_response]);

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">My Child Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching child details" />}

      {childData && childData !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto mb-4 h-24 w-24 sm:h-40 sm:w-40">
            <Image
              src={(childData?.profile_image?.url as string) || placeholder}
              width={150}
              height={150}
              alt={childData?.first_name + "image" || "Placeholder"}
              className="h-full w-full rounded object-center"
            />
          </div>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2 className="font-bold">Child Details</h2>

              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell className="uppercase">{childData?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Verified</TableHead>
                    <TableCell
                      className={`uppercase ${
                        childData.is_verified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {childData?.is_verified ? "Yes" : "No"}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell
                      className={`uppercase ${
                        childData.status ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {childData?.status}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableCell className="uppercase">{childData?.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableCell className="uppercase">{childData?.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Name</TableHead>
                    <TableCell className="uppercase">{childData?.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Middle Name</TableHead>
                    <TableCell className="uppercase">
                      {childData?.middle_name || "not set"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Date of Birth</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(childData?.dob as string)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Gender</TableHead>
                    <TableCell className="uppercase">{childData?.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableCell>{childData?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Phone</TableHead>
                    <TableCell className="uppercase">{childData?.phone ?? "Not set"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableCell className="uppercase">
                      {childData?.home_address ?? "No address available"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button
                          onClick={() =>
                            router.push(`/dashboard/parent/children/${childData._id}/make_payment`)
                          }
                          variant="success"
                          className="rounded text-white"
                        >
                          Pay Fee
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="w-full space-y-2 rounded border p-4">
                <h3 className="font-bold">Account Details</h3>

                {childData?.studentAccountDetails ? (
                  <Table className="border">
                    <TableBody>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Name</TableHead>
                        <TableCell className="uppercase">
                          {childData?.studentAccountDetails?.account_name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Number</TableHead>
                        <TableCell className="uppercase">
                          {childData?.studentAccountDetails?.account_number}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Balance</TableHead>
                        <TableCell className="uppercase">
                          {TextHelper.FormatAmount(
                            childData?.studentAccountDetails?.account_balance,
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Reference</TableHead>
                        <TableCell className="uppercase">
                          {childData?.studentAccountDetails?.customer_reference}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Creation Date</TableHead>
                        <TableCell className="uppercase">
                          {TextHelper.getFormattedDate(childData?.studentAccountDetails?.createdAt)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="space-y-2">
                    <Separator />
                    <h1>Your child has no account yet.</h1>
                    <p>Please contact the school authority</p>
                  </div>
                )}
              </div>

              <div className="w-full space-y-2 rounded border p-4">
                <h3 className="font-bold">Academic Records</h3>

                <Table className="border">
                  <TableBody>
                    <TableRow>
                      <TableHead>Admission Number</TableHead>
                      <TableCell className="uppercase">{childData.admission_number}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Admission Session</TableHead>
                      <TableCell className="uppercase">{childData?.admission_session}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Current Class</TableHead>
                      <TableCell className="uppercase">{childData?.current_class_level}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Debt</TableHead>
                      <TableCell className="uppercase">
                        <span className="text-red-600">₦{childData.outstanding_balance}</span>
                        {childData.outstanding_balance > 0 && (
                          <span className="cursor-pointer rounded bg-green-600 p-0.5 text-xs text-white hover:bg-green-700">
                            Pay now
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Current Term Fee</TableHead>
                      <TableCell className="uppercase">
                        ₦{childData?.latest_payment_document?.total_amount ?? "Unavailable"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Outstanding Term Fee</TableHead>
                      <TableCell className="uppercase">
                        ₦{childData?.latest_payment_document?.remaining_amount ?? "Unavailable"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Cummulative Score</TableHead>
                      <TableCell className="uppercase">
                        {childData?.cumulative_score ?? "Not set"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Overal Position</TableHead>
                      <TableCell className="uppercase">
                        {childData?.overall_position ?? "Not set"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <div className="flex items-center justify-center">
                          <Button onClick={() => router.push(`${params.child_id}/results`)}>
                            View Results
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <NewSessionSubscription
              student_id={childData._id}
              open={showNewSubscription}
              closeOnSuccess={() => setShowNewSessionSubscription(false)}
              onClose={() => setShowNewSessionSubscription(false)}
            />
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
