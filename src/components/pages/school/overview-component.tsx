"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function OverviewComponent() {
  return (
    <div className="z-10">
      <div className="flex flex-col gap-4">
        {/* <SchoolInfoHero schoolDetails={schoolDetails as School} /> */}

        <div className="flex w-full flex-1 flex-col justify-evenly gap-4 md:min-h-[25rem] lg:flex-row">
          <Card className="bg-sidebar min-h-[15rem] w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:text-lg">
                <Calendar /> Events
              </CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="py-4">
              <div>
                <p>No events available yet.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-sidebar min-h-[15rem] w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:text-lg">
                <Bell /> Announcements
              </CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="py-4">
              <div>
                <p>No announcement available yet.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
