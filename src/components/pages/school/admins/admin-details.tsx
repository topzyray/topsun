"use client";

import { Separator } from "@/components/ui/separator";
import { SchoolAdminUser } from "../../../../../types";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import BackButton from "@/components/buttons/BackButton";
import ErrorBox from "@/components/atoms/error-box";
import { TextHelper } from "@/helpers/TextHelper";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { AdminApiService } from "@/api/services/AdminApiService";

export default function AdminDetails({ params }: { params: Record<string, any> }) {
  let { data, isLoading, isError, error } = useCustomQuery(
    ["adminById"],
    () => AdminApiService.getAdminByAdminIdInMySchool(params.admin_id),
    { id: params.admin_id },
  );

  let admin: SchoolAdminUser = data?.school_admin !== undefined && data?.school_admin;

  let status_color;

  switch (admin?.status) {
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

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Admin Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching admin details" />}

      {admin && admin !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2>Admin Details</h2>
              <Separator />
              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell className="uppercase">{admin?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Verified</TableHead>
                    <TableCell
                      className={`uppercase ${
                        admin.is_verified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {admin?.is_verified ? "Yes" : "No"}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell className={`uppercase ${status_color}`}>
                      {admin?.status ? "Active" : "Inactive"}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableCell className="uppercase">{admin?.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableCell className="uppercase">{admin?.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Name</TableHead>
                    <TableCell className="uppercase">{admin?.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Middle Name</TableHead>
                    <TableCell className="uppercase">{admin?.middle_name || "not set"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Date of Birth</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(admin?.dob as string)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Gender</TableHead>
                    <TableCell className="uppercase">{admin?.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableCell>{admin?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Phone</TableHead>
                    <TableCell className="uppercase">{admin?.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Employment Date</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(admin?.employment_date as string)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {isError && <ErrorBox error={error} />}
    </div>
  );
}
