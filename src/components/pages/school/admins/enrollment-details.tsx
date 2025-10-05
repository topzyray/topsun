"use client";

import { Separator } from "@/components/ui/separator";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { Enrollment } from "../../../../../types";
import { ClassEnrollmentApiService } from "@/api/services/ClassEnrollmentApiService";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import BackButton from "@/components/buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EnrollmentDetails({ params }: { params: Record<string, any> }) {
  // Handle enrollment data fetching
  const { data, isLoading, isError, error } = useCustomQuery(
    ["enrollmentById"],
    () => ClassEnrollmentApiService.getEnrollmentByIdInASchool(params.enrollment_id),
    { id: params.enrollment_id },
  );

  const enrollmentData: Enrollment = data?.enrollment !== undefined && data?.enrollment;

  let status_color = "";
  switch (enrollmentData?.status) {
    case "enrolled":
      status_color = "text-blue-600";
      break;
    case "completed":
      status_color = "text-green-600";
      break;
    case "to_repeat":
      status_color = "text-orange-600";
      break;
    default:
      status_color = "";
      break;
  }

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Enrollment Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching enrollment details" />}

      {enrollmentData && enrollmentData !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <div className="space-y-4">
                <div className="w-full space-y-3">
                  <h2>Enrollment Details</h2>

                  <Table className="border">
                    <TableBody>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableCell className="uppercase">{enrollmentData?._id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableCell className={`${status_color} capitalize`}>
                          {enrollmentData?.status}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Is Active</TableHead>
                        <TableCell
                          className={`${
                            enrollmentData.is_active ? "text-green-600" : "text-orange-600"
                          } capitalize`}
                        >
                          {enrollmentData?.is_active ? "True" : "False"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Level</TableHead>
                        <TableCell className="capitalize">{enrollmentData?.level}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Date Created</TableHead>
                        <TableCell className="capitalize">
                          {TextHelper.getFormattedDate(enrollmentData?.createdAt)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div className="w-full space-y-3">
                  <h2>Session Details</h2>

                  <Table className="border">
                    <TableBody>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableCell className="uppercase">
                          {enrollmentData?.academic_session_id?.academic_session}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableCell
                          className={`${
                            enrollmentData.academic_session_id.is_active
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {enrollmentData.academic_session_id.is_active ? "Active" : "Ended"}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableHead>Promotion Done</TableHead>
                        <TableCell
                          className={`${
                            enrollmentData?.academic_session_id?.is_promotion_done
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {enrollmentData?.academic_session_id?.is_promotion_done ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Term Details</TableHead>
                        <TableCell className="capitalize">
                          <ul className="flex flex-wrap gap-x-1">
                            {enrollmentData.academic_session_id.terms.length > 0 &&
                              enrollmentData.academic_session_id.terms.map((term) => (
                                <li key={term._id} className="flex gap-x-1 text-sm capitalize">
                                  {term.name.split("_").join(" ")}
                                  <Separator orientation="vertical" />
                                </li>
                              ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="flex w-full flex-col gap-4">
                <div className="w-full space-y-3 rounded border p-4">
                  <h2>
                    <span>Total Students Enrolled = </span>
                    <span>({enrollmentData?.students && enrollmentData?.students.length})</span>
                  </h2>

                  <Table className="border">
                    <TableHeader>
                      <TableRow>
                        {[
                          "S/N",
                          "Name",
                          "Admission No.",
                          "Email",
                          "Status",
                          "Cum. Score",
                          "Overall Position",
                        ].map((title) => (
                          <TableCell key={title} className="text-nowrap">
                            {title}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollmentData?.students &&
                        enrollmentData?.students.length > 0 &&
                        enrollmentData?.students.map((student, index) => (
                          <TableRow key={student._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="text-nowrap capitalize">{`${student?.student?.first_name} ${student?.student?.last_name}`}</TableCell>
                            <TableCell className="text-nowrap">
                              {student?.student?.admission_number}
                            </TableCell>
                            <TableCell className="text-nowrap">{student?.student?.email}</TableCell>
                            <TableCell
                              className={`capitalize ${
                                student?.student?.status === "active"
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {student?.student?.status}
                            </TableCell>
                            <TableCell
                              className={`capitalize ${
                                student?.student?.cumulative_score
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {student?.student?.cumulative_score ?? "Pending"}
                            </TableCell>
                            <TableCell
                              className={`capitalize ${
                                student?.student?.cumulative_score
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {student?.student?.overall_position ?? "Pending"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {enrollmentData?.students.length < 1 && (
                    <p className="text-sm">No student enrolled yet.</p>
                  )}
                </div>
              </div>
            </div>
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
