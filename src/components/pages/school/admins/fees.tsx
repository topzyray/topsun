"use client";

import React from "react";
import BackButton from "@/components/buttons/BackButton";
import { Separator } from "@/components/ui/separator";
import { SchoolFeeTable } from "../../../tables/school/admins/school-fees-table";
import { MandatoryFeeTable } from "@/components/tables/school/admins/mandatory-fees-table";
import { OptionalFeeTable } from "@/components/tables/school/admins/optional-fees-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AddPaymentPriorityForSchoolForm from "@/components/forms/school/admins/add-payment-priority-for-school-form";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { RoleTypeEnum } from "@/api/enums/RoleTypeEnum";

export default function FeesComponent() {
  const [openPriorityForm, setOpenPriorityForm] = React.useState(false);
  // const [renderFee, setRenderFee] = React.useState({
  //   schoolFee: true,
  //   mandatoryFee: false,
  //   optionalFee: false,
  //   optionalFeeInTerm: false,
  //   mandatoryFeeInTerm: false,
  // });

  const { userDetails } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      {userDetails?.role === RoleTypeEnum.SUPER_ADMIN && (
        <>
          {" "}
          <Separator />
          <div>
            <Button onClick={() => setOpenPriorityForm(true)}>Create Fee Priority</Button>
          </div>
        </>
      )}

      <Separator />

      <div>
        <div className="pb-4">
          <h2 className="text-lg uppercase">All School fees</h2>
        </div>

        <Separator />

        <Tabs defaultValue="schoolFee" className="w-full">
          <Separator />
          <TabsList className="h-[2.5rem] rounded">
            <TabsTrigger
              value="schoolFee"
              className="h-full rounded text-base hover:cursor-pointer hover:opacity-70"
            >
              School Fee
            </TabsTrigger>
            <TabsTrigger
              value="mandatoryFee"
              className="h-full rounded text-base hover:cursor-pointer hover:opacity-70"
            >
              Mandatory Fee
            </TabsTrigger>
            <TabsTrigger
              value="optionalFee"
              className="h-full rounded text-base hover:cursor-pointer hover:opacity-70"
            >
              Optional Fee
            </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="schoolFee">
            <SchoolFeeTable />
          </TabsContent>
          <TabsContent value="mandatoryFee">
            <MandatoryFeeTable />
          </TabsContent>
          <TabsContent value="optionalFee">
            <OptionalFeeTable />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add payment priority */}
      <AddPaymentPriorityForSchoolForm
        open={openPriorityForm}
        onClose={() => {
          setOpenPriorityForm(false);
        }}
        closeOnSuccess={() => {
          setOpenPriorityForm(false);
        }}
      />
    </div>
  );
}
