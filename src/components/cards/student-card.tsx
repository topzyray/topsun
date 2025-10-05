"use client";

import Image from "next/image";
import placeholder from "../../../public/images/placeholder.png";
import { Student } from "../../../types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { TextHelper } from "@/helpers/TextHelper";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export default function StudentCardComponent({ data }: { data: Student }) {
  const router = useRouter();

  return (
    <div className="h-full max-h-full w-full max-w-2xl rounded p-4 transition-all duration-300 ease-in-out hover:shadow">
      <div className="flex flex-col border p-4">
        <div className="flex w-full flex-row items-start justify-center border py-2">
          <div className="mx-auto mb-4 h-24 w-24 sm:h-40 sm:w-40">
            <Image
              src={(data?.profile_image?.url as string) || placeholder}
              width={150}
              height={150}
              alt={data?.first_name + "image" || "Placeholder"}
              className="h-full w-full rounded object-center"
            />
          </div>
        </div>
        <div className="w-full">
          <div>
            <Table className="border">
              <TableBody>
                {/* Bio data */}
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell className="font-bold uppercase">{`${data?.last_name} ${data?.first_name} ${data?.middle_name}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell className="font-bold uppercase">{data?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender</TableCell>
                  <TableCell className="font-bold uppercase">{data?.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell className="font-bold uppercase">
                    {TextHelper.getFormattedDate(data?.dob as string)}
                  </TableCell>
                </TableRow>

                {/* Account Details */}
                {data?.studentAccountDetails ? (
                  <>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell className="font-bold uppercase">
                        {data?.studentAccountDetails?.account_name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Account Number</TableCell>
                      <TableCell className="font-bold uppercase">
                        {data?.studentAccountDetails?.account_number}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Account Balance</TableCell>
                      <TableCell className="font-bold uppercase">
                        {TextHelper.FormatAmount(data?.studentAccountDetails?.account_balance)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Account Reference</TableCell>
                      <TableCell className="font-bold uppercase">
                        {data?.studentAccountDetails?.customer_reference}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Creation Date</TableCell>
                      <TableCell className="font-bold uppercase">
                        {TextHelper.getFormattedDate(data?.studentAccountDetails?.createdAt)}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  ""
                )}

                {/* Academics */}
                <TableRow>
                  <TableCell>Admission Number</TableCell>
                  <TableCell className="font-bold uppercase">{data?.admission_number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Current Session</TableCell>
                  <TableCell className="font-bold uppercase">{data?.admission_session}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Current Class</TableCell>
                  <TableCell className="font-bold uppercase">{data?.current_class_level}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Enrolment Status</TableCell>
                  <TableCell className="font-bold uppercase">
                    <span
                      className={`${
                        data.active_class_enrolment ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {data.active_class_enrolment ? "Enrolled" : "Not enrolled"}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Debt</TableCell>
                  <TableCell className="font-bold uppercase">
                    <span className="text-red-600">₦ {data.outstanding_balance}</span>
                    {data.outstanding_balance > 0 && (
                      <span
                        onClick={() => router.push(`children/${data._id}/make_payment`)}
                        className="cursor-pointer rounded bg-green-600 p-0.5 text-xs text-white hover:bg-green-700"
                      >
                        Pay now
                      </span>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Current Fee</TableCell>
                  <TableCell className="font-bold uppercase">
                    ₦ {data?.latest_payment_document?.total_amount ?? "Unavailable"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Remaining Fee</TableCell>
                  <TableCell className="font-bold uppercase">
                    ₦ {data?.latest_payment_document?.remaining_amount ?? "Unavailable"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 border px-2 py-2">
          <Button
            onClick={() => router.push(`/dashboard/parent/children/${data._id}`)}
            className="font-normal"
          >
            Details
          </Button>

          <Button
            onClick={() => router.push(`/dashboard/parent/children/${data._id}/make_payment`)}
            variant="success"
            className="rounded text-white"
          >
            Pay Fee
          </Button>
        </div>
      </div>
    </div>
  );
}
