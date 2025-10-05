import { Card, CardContent } from "@/components/ui/card";
import { ExamQuestionMetadata } from "../../../../../types";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { TextHelper } from "@/helpers/TextHelper";
import { Separator } from "@/components/ui/separator";
import TimerBadge from "./timer-badge";

interface QuestionsMetadata {
  metaData: ExamQuestionMetadata;
  className?: string;
}

export default function QuestionsMetadata({ metaData, className }: QuestionsMetadata) {
  return (
    <Card
      className={`sticky top-20 hidden w-full max-w-sm py-6 shadow-md lg:mt-10 lg:block ${className}`}
    >
      <CardContent className="space-y-4 p-4">
        <h2 className="hidden text-lg font-semibold lg:block lg:text-xl">Exam Metadata</h2>

        <Separator className="hidden lg:block" />

        <div>
          <Table className="border">
            <TableBody>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableCell className="capitalize">{metaData?.subject_id?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Time Allocated</TableHead>
                <TableCell className="capitalize">
                  {TextHelper.getFormattedDuration(metaData?.obj_total_time_allocated)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Time Left</TableHead>
                <TableCell className="capitalize">
                  <TimerBadge
                    timeLeft={metaData?.time_left as number}
                    totalTime={metaData?.obj_total_time_allocated}
                    showIcon
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Subject Teacher</TableHead>
                <TableCell className="capitalize">
                  {`${metaData?.subject_teacher?.first_name} ${metaData?.subject_teacher?.last_name}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Class Level</TableHead>
                <TableCell className="capitalize">{metaData?.level}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Exam Status</TableHead>
                <TableCell className="capitalize">{metaData?.obj_status || "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Total Questions</TableHead>
                <TableCell className="capitalize">{metaData?.total_questions}</TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Date Started</TableHead>
                <TableCell className="capitalize">
                  {TextHelper.getFormattedDate(metaData?.obj_start_time)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Time Started</TableHead>
                <TableCell className="capitalize">
                  {TextHelper.getFormattedTime(metaData?.obj_start_time)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Term</TableHead>
                <TableCell className="capitalize">
                  {metaData?.term && metaData?.term.replace(/_/g, " ")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
