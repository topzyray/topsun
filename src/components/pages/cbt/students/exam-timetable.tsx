"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextHelper } from "@/helpers/TextHelper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import ErrorBox from "@/components/atoms/error-box";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExamTimetable() {
  const { examTimetable } = useContext(GlobalContext);
  const router = useRouter();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mt-5 w-full max-w-4xl py-12 shadow-md lg:mt-10 lg:py-18">
        <CardContent className="p-4">
          <div className="space-y-6 lg:px-10">
            <h1 className="text-center text-2xl font-bold uppercase lg:text-4xl">
              🗓️ Exam Timetable
            </h1>

            <Separator />

            <p className="text-sm sm:text-lg lg:text-xl">
              Below are your scheduled subjects. Be punctual and prepared.
            </p>

            <div className="h-full max-h-[20rem] overflow-auto">
              {examTimetable?.loading ? (
                <CircularLoader text="Loading exam timetable" />
              ) : examTimetable?.data ? (
                <Table className="border">
                  <TableHeader className="text-nowrap">
                    <TableRow>
                      <TableHead>S/N</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exam Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-nowrap">
                    {examTimetable?.data?.scheduled_subjects &&
                      examTimetable?.data?.scheduled_subjects.length &&
                      examTimetable?.data?.scheduled_subjects.map((exam, index) => (
                        <TableRow key={exam?._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="capitalize">{exam?.subject_id?.name}</TableCell>
                          <TableCell>{TextHelper.getFormattedDate(exam?.start_time)}</TableCell>
                          <TableCell>{TextHelper.getFormattedTime(exam?.start_time)}</TableCell>
                          <TableCell>{TextHelper.getFormattedDuration(exam?.duration)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : examTimetable?.error ? (
                <ErrorBox error={examTimetable?.error} />
              ) : (
                <div>
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-4">
              <Button onClick={() => router.back()}>Back</Button>

              <Button
                onClick={() => router.push("subjects")}
                disabled={examTimetable?.loading || examTimetable?.error !== null}
              >
                Proceed to Examinable Subjects
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
