"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { TextHelper } from "@/helpers/TextHelper";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import { SubmittedOBJExamResponse } from "../../../../../types";
import { useEffect, useState } from "react";

export default function ExamSubmitted() {
  const [pageReady, setPageReady] = useState(false);
  const router = useRouter();

  const storedData = StorageUtilsHelper.getItemsFromLocalStorage([STORE_KEYS.OBJ_EXAM_RESULT]);

  const resultData = storedData[STORE_KEYS.OBJ_EXAM_RESULT] as {
    data: SubmittedOBJExamResponse;
  };

  useEffect(() => {
    if (!resultData?.data) {
      router.back();
    } else {
      setPageReady(true);
    }
  }, [resultData?.data, router]);

  if (!pageReady) return null;

  const objExamResult = resultData?.data;

  if (!objExamResult) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive text-lg font-semibold">❌ Unable to load exam result.</p>
        <Button onClick={() => router.replace("/dashboard/student/overview")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mt-10 w-full max-w-4xl py-12 shadow-md lg:mt-20 lg:py-18">
        <CardContent className="p-4">
          <div className="space-y-6 lg:px-10">
            <div className="flex justify-center">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>

            <h1 className="text-center text-2xl font-bold uppercase lg:text-4xl">Exam Submitted</h1>

            <p className="text-muted-foreground">
              Your exam has been submitted successfully. Below are your score summary:
            </p>

            <div>
              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>Exam Status</TableHead>
                    <TableCell className="text-green-600 capitalize">
                      {objExamResult?.obj_status}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Submission Type</TableHead>
                    <TableCell className="capitalize">
                      {objExamResult?.obj_trigger_type &&
                        objExamResult?.obj_trigger_type.replace(/_/g, " ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Total Questions</TableHead>
                    <TableCell>
                      {objExamResult?.shuffled_obj_questions &&
                        objExamResult?.shuffled_obj_questions.length}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Total Score</TableHead>
                    <TableCell>
                      {objExamResult?.objective_total_score} question(s) out of{" "}
                      {objExamResult?.shuffled_obj_questions &&
                        objExamResult?.shuffled_obj_questions.length}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Percentage Score</TableHead>
                    <TableCell>{objExamResult?.percent_score}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Term</TableHead>
                    <TableCell className="capitalize">
                      {objExamResult?.term && objExamResult?.term.replace(/_/g, " ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Date Submitted</TableHead>
                    <TableCell>
                      {TextHelper.getFormattedDate(objExamResult?.obj_submitted_at as string)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Time Submitted</TableHead>
                    <TableCell>
                      {TextHelper.getFormattedTime(objExamResult?.obj_submitted_at as string)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  StorageUtilsHelper.deleteFromLocalStorage([STORE_KEYS.OBJ_EXAM_RESULT]);
                  router.replace("/dashboard/student/overview");
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
