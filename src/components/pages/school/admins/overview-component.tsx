"use client";

import { useAuth } from "@/api/hooks/use-auth.hook";
import { SchoolOwnerAdminOverview, SummaryObject } from "../../../../../types";
import { RadialChartCard } from "@/components/charts/RadialChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { AdminApiService } from "@/api/services/AdminApiService";
import ErrorBox from "@/components/atoms/error-box";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { Separator } from "@/components/ui/separator";
import { ReactNode, useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Settings, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextHelper } from "@/helpers/TextHelper";

export default function SchoolOwnerAdminOverviewComponent() {
  const { userDetails } = useAuth();
  const { activeSessionData } = useContext(GlobalContext);

  const { data, isLoading, isError, error } = useCustomQuery(
    ["overview"],
    AdminApiService.getMySchoolSummary,
  );

  const overviewData: SchoolOwnerAdminOverview =
    data?.school_summary !== undefined && data?.school_summary;

  const usersSummaryData =
    userDetails?.role === "admin" &&
    overviewData?.users_summary_array &&
    overviewData?.users_summary_array.length
      ? overviewData?.users_summary_array.filter((summary) => summary.key !== "admins")
      : overviewData?.users_summary_array;

  const enrollmentData = overviewData?.class_enrolments?.enrolment_data.map((enrollment) => ({
    class_name: enrollment.class.name,
    students: enrollment.students.length,
  }));

  return (
    <div className="z-10">
      <div className="mx-auto flex flex-col gap-0 px-4 sm:container sm:px-0">
        {/* <SchoolInfoHero schoolDetails={schoolDetails as School} /> */}

        <div className="mt-4 flex w-full flex-wrap items-center justify-between md:mt-6">
          <div>
            <h1 className="text-foreground flex items-center gap-3 text-xl font-bold md:text-3xl">
              <Shield className="text-primary h-8 w-8" />
              {TextHelper.capitalizeWords(userDetails?.role?.replace("_", " ") as string)} Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">System overview and management</p>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>

        <div className="mt-4">
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
        </div>

        {isLoading ? (
          <CircularLoader
            text="Loading overview data..."
            parentClassName="mt-20"
            textClassName="text-base"
          />
        ) : overviewData ? (
          <>
            <div className="space-y-6 border-b py-10">
              <div>
                <h1 className="text-center text-3xl font-bold md:text-5xl">Analytics</h1>
              </div>
              <div
                // className="flex flex-wrap items-center justify-center gap-4"
                className="mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {usersSummaryData.map((stat, index) => (
                  <StatsCard
                    key={index}
                    stat={stat}
                    index={index}
                    icon={<Users className="text-primary h-8 w-8" />}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6 border-b py-10">
              <div>
                <h1 className="text-center text-3xl font-bold md:text-5xl">Academics Summary</h1>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {overviewData?.academic_summary_array &&
                  overviewData?.academic_summary_array.map((summary) => (
                    <div
                      key={summary?.key}
                      className="w-full flex-shrink-0 sm:w-[300px] md:w-[250px] lg:w-[300px] xl:w-[320px]"
                    >
                      <RadialChartCard
                        title={summary?.title}
                        // description={`Date: ${TextHelper.getFormattedDate(
                        //   Date()
                        // )}`}
                        data={[
                          {
                            // browser: "safari",
                            [summary?.key]: summary.total_count,
                            fill: "var(--color-safari)",
                          },
                        ]}
                        config={{
                          [summary?.key]: { label: summary?.key },
                          // safari: {
                          //   label: "Safari",
                          //   color: "hsl(var(--chart-2))",
                          // },
                        }}
                        dataKey={summary?.key}
                        label={summary?.title}
                        // statChangeText="Trending up by 5.2% this month"
                        footerText={summary?.summary}
                        endAngle={summary?.total_count}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="py-10">
              <div className="flex flex-col items-center justify-evenly gap-4 sm:flex-row">
                {/* <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl md:text-5xl text-center font-semibold">
                      Available Classes
                    </h1>
                  </div>
                  <div>
                    <BarChartCard
                      title="Classes"
                      description={`Date: ${TextHelper.getFormattedDate(
                        Date()
                      )}`}
                      data={[
                        { month: "January", desktop: 186 },
                        { month: "February", desktop: 305 },
                        { month: "March", desktop: 237 },
                        { month: "April", desktop: 73 },
                        { month: "May", desktop: 209 },
                        { month: "June", desktop: 214 },
                      ]}
                      config={{
                        desktop: {
                          label: "Desktop",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      xAxisKey="month"
                      barKeys={["desktop"]}
                      barColorMap={{
                        desktop: "var(--color-desktop)",
                      }}
                      statChangeText="Trending up by 5.2% this month"
                      footerText="Showing total visitors for the last 6 months"
                    />
                  </div>
                </div> */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-center text-3xl font-semibold md:text-5xl">
                      Class Enrollments
                    </h1>
                  </div>
                  <div>
                    {enrollmentData && enrollmentData.length > 0 ? (
                      <BarChartCard
                        title="Current Enrollments"
                        description={`Session: ${activeSessionData?.activeSession?.academic_session}`}
                        data={enrollmentData}
                        config={{
                          students: {
                            label: "Total Students Enrolled: ",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        xAxisKey="class_name"
                        barKeys={["students"]}
                        // barColorMap={{
                        //   students: "var(--color-desktop)",
                        // }}
                        // statChangeText="Trending up by 5.2% this month"
                        footerText="Showing total class enrollments for the current active session"
                      />
                    ) : (
                      <p>No enrolment data found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* <div>
          <div className="flex justify-center items-center flex-wrap gap-4">
            <div>Classes</div>
            <div>Enrollments</div>
          </div>
        </div>
        <div>
          <AspectRatio ratio={50 / 15} className="bg-sidebar">
            Just testing
          </AspectRatio>
        </div> */}
          </>
        ) : isError ? (
          <ErrorBox error={error} />
        ) : (
          <div>No Data Available in School Yet</div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ stat, index, icon }: { stat: SummaryObject; index: number; icon: ReactNode }) {
  return (
    <motion.div
      key={stat.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="w-full"
    >
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-lg font-medium">Total {stat?.title}</p>
              <p className="text-6xl font-bold">{stat?.total_count}</p>
              <Badge variant="default" className="mt-1">
                {stat?.summary}
              </Badge>
            </div>
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
