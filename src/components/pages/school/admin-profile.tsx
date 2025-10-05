"use client";
import { useAuth } from "@/api/hooks/use-auth.hook";
import React from "react";
import placeholder from "../../../../public/images/placeholder.png";
import Image from "next/image";
import { Student } from "../../../../types";
import { TextHelper } from "@/helpers/TextHelper";

export default function AdminProfile() {
  const { userDetails } = useAuth();

  const userObj = userDetails as Student;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-42">
        <Image
          src={(userObj?.profile_image?.url as string) || placeholder}
          width={150}
          height={150}
          alt={userObj?.first_name + "image" || "Placeholder"}
          className="h-full w-full rounded-full object-center"
        />
      </div>
      <div className="bg-sidebar flex w-full flex-col items-center justify-between space-y-2 p-2 md:flex-row">
        <div className="w-full space-y-2 md:w-[45%]">
          <div className="flex justify-between text-sm">
            <span className="uppercase">First name:</span>
            <span className="capitalize">{userObj?.first_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase">Last name:</span>
            <span className="capitalize">{userObj?.last_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase">Middle name:</span>
            <span className="capitalize">{userObj?.middle_name || "not set"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase">DoB:</span>
            <span className="capitalize">
              {TextHelper.getFormattedDate(userObj?.dob as string)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase">Gender:</span>
            <span className="capitalize">{userObj?.gender}</span>
          </div>
        </div>
        <div className="w-full space-y-2 md:w-[45%]">
          <div className="flex justify-between text-sm">
            <span className="uppercase">Email: </span>
            <span>{userObj?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase">Phone: </span>
            <span>{userObj?.phone || "Not set"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase">Current Class:</span>
            <span>{userObj?.current_class?.class_id?.name || "Not set"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase">Home Address: </span>
            <span>{userObj?.home_address || "Not set"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
