"use client";

import { Separator } from "@/components/ui/separator";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import BackButton from "@/components/buttons/BackButton";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { ContactUsApiService } from "@/api/services/ContactUsApiService";
import { Ticket } from "../../../../../types";

export default function TicketDetails({ params }: { params: Record<string, any> }) {
  let { data, isLoading, isError, error } = useCustomQuery(
    ["ticketById"],
    () => ContactUsApiService.getContactUsById(params.ticket_id),
    { id: params.ticket_id },
  );

  let ticketData: Ticket = data?.contact_us_message !== undefined && data?.contact_us_message;

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Ticket Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching ticket details" />}

      {ticketData && ticketData !== null && (
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4">
              <h2>Ticket Details</h2>
              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableCell className="uppercase">{ticketData?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableCell className="uppercase">{ticketData?.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Name</TableHead>
                    <TableCell className="uppercase">{ticketData?.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableCell>{ticketData?.school_name || "Not applicable"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableCell>{ticketData?.email}</TableCell>
                  </TableRow>
                  <TableRow className="">
                    <TableHead>Message</TableHead>
                    <TableCell className="w-2/3 text-wrap">{ticketData?.message}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
