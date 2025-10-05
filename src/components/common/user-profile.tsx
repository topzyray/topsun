"use client";

import Image from "next/image";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import { Parent, Student, Teacher, User } from "../../../types";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { TextHelper } from "@/helpers/TextHelper";
import placeholder from "../../../public/images/placeholder.png";
import BackButton from "../buttons/BackButton";
import { Separator } from "../ui/separator";

export default function UserProfileComponent() {
  let { userDetails } = useAuth();

  userDetails = (userDetails as Student | Teacher | Parent | User) ?? {};

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>

        <Separator />

        <div className="">
          <h1 className="text-lg uppercase">User profile page</h1>
        </div>

        <Separator />
        <div className="mt-4">
          {isStudent(userDetails) && (
            <div className="mx-auto mb-4 h-24 w-24 sm:h-40 sm:w-40">
              <Image
                src={(userDetails?.profile_image?.url as string) || placeholder}
                width={150}
                height={150}
                alt={userDetails?.first_name + "image" || "Placeholder"}
                className="h-full w-full rounded object-center"
              />
            </div>
          )}

          <div className="mx-auto flex max-w-5xl flex-col items-start justify-center gap-4 md:flex-row">
            <div className="mx-auto w-full max-w-xl space-y-3 rounded border p-4">
              <div className="">
                <h1 className="font-bold">Bio-Data</h1>
              </div>

              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead className="text-nowrap">ID</TableHead>
                    <TableCell className="uppercase">{userDetails?._id}</TableCell>
                  </TableRow>
                  {userDetails && userDetails?.is_verified && (
                    <TableRow>
                      <TableHead className="text-nowrap">Verified</TableHead>
                      <TableCell
                        className={`uppercase ${
                          userDetails?.is_verified ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {userDetails?.is_verified ? "Yes" : "No"}{" "}
                      </TableCell>
                    </TableRow>
                  )}
                  {userDetails && userDetails?.status && (
                    <TableRow>
                      <TableHead className="text-nowrap">Status</TableHead>
                      <TableCell
                        className={`uppercase ${
                          userDetails?.status ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {userDetails?.status}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableHead className="text-nowrap">Role</TableHead>
                    <TableCell className="uppercase">{userDetails?.role}</TableCell>
                  </TableRow>
                  {isStudent(userDetails) && (
                    <TableRow>
                      <TableHead className="text-nowrap">Current Level</TableHead>
                      <TableCell className="uppercase">
                        {userDetails?.current_class?.class_id?.level ||
                          userDetails?.current_class_level ||
                          "Not set"}
                      </TableCell>
                    </TableRow>
                  )}
                  {isStudent(userDetails) && (
                    <TableRow>
                      <TableHead className="text-nowrap">Current Class</TableHead>
                      <TableCell className="uppercase">
                        {userDetails?.current_class?.class_id?.name || "Not enrolled"}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableHead className="text-nowrap">First Name</TableHead>
                    <TableCell className="uppercase">{userDetails?.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-nowrap">Last Name</TableHead>
                    <TableCell className="uppercase">{userDetails?.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-nowrap">Middle Name</TableHead>
                    <TableCell className="uppercase">
                      {userDetails?.middle_name || "not set"}
                    </TableCell>
                  </TableRow>
                  {userDetails && userDetails?.dob && (
                    <TableRow>
                      <TableHead className="text-nowrap">Date of Birth</TableHead>
                      <TableCell className="uppercase">
                        {TextHelper.getFormattedDate(userDetails?.dob as string)}
                      </TableCell>
                    </TableRow>
                  )}
                  {userDetails && userDetails?.gender && (
                    <TableRow>
                      <TableHead className="text-nowrap">Gender</TableHead>
                      <TableCell className="uppercase">{userDetails?.gender}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableHead className="text-nowrap">Email</TableHead>
                    <TableCell>{userDetails?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-nowrap">Phone</TableHead>
                    <TableCell className="uppercase">{userDetails?.phone ?? "Not set"}</TableCell>
                  </TableRow>
                  {isStudent(userDetails) && (
                    <TableRow>
                      <TableHead className="text-nowrap">Address</TableHead>
                      <TableCell className="max-w-sm text-wrap uppercase">
                        {userDetails?.home_address ?? "Not set"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {isStudent(userDetails) && (
              <div className="mx-auto w-full max-w-xl space-y-3 rounded border p-4">
                <div className="">
                  <h1 className="font-bold">Account Details</h1>
                </div>

                {userDetails?.studentAccountDetails ? (
                  <Table className="border">
                    <TableBody>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Name</TableHead>
                        <TableCell className="uppercase">
                          {userDetails?.studentAccountDetails?.account_name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Number</TableHead>
                        <TableCell className="uppercase">
                          {userDetails?.studentAccountDetails?.account_number}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Balance</TableHead>
                        <TableCell className="uppercase">
                          {TextHelper.FormatAmount(
                            userDetails?.studentAccountDetails?.account_balance,
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Account Reference</TableHead>
                        <TableCell className="uppercase">
                          {userDetails?.studentAccountDetails?.customer_reference}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="text-nowrap">Creation Date</TableHead>
                        <TableCell className="uppercase">
                          {TextHelper.getFormattedDate(
                            userDetails?.studentAccountDetails?.createdAt,
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div>
                    <h1>You have not account yet. Please contact the school authtority</h1>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function isStudent(user: Student | Teacher | Parent | User): user is Student {
  return (user as Student).home_address !== undefined;
}
