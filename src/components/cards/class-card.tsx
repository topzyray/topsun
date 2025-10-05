"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ResultApiService } from "@/api/services/ResultApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "../buttons/SubmitButton";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";

export default function ClassCardComponent({
  data,
  action_from,
}: {
  data: any;
  action_from: "class_teacher" | "subject_teacher";
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  let { mutate: generateClassPositions, isPending: isGeneratingClassPositions } = useCustomMutation(
    ResultApiService.generateClassPositionForStudents,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["results"] });
      },
    },
  );

  return (
    <div className="h-full max-h-full w-full max-w-5xl rounded border p-4 transition-all duration-300 ease-in-out hover:shadow">
      <div className="flex flex-row gap-2">
        <div className="flex w-full flex-col gap-1.5 text-sm sm:text-base">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold uppercase">Class Data</h2>
            <Table className="border">
              <TableBody>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableCell>{data?.class_id?.level || data?.level}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableCell>{data?.class_id?.name || data?.name}</TableCell>
                </TableRow>
                {(data?.class_id?.section || data?.section) && (
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableCell>{data?.class_id?.section || data?.section}</TableCell>
                  </TableRow>
                )}
                {data?.subject?.name && (
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableCell className="uppercase">{data?.subject?.name}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {action_from === "subject_teacher" && (
                        <Button
                          onClick={() =>
                            router.push(
                              `/dashboard/teacher/classes/${
                                data?.class_id?._id
                              }/${encodeURIComponent(
                                data?.class_id?.level,
                              )}/subjects/${data?.subject?._id}`,
                            )
                          }
                        >
                          Record Scores
                        </Button>
                      )}

                      {action_from === "subject_teacher" && (
                        <Button
                          onClick={() =>
                            router.push(
                              `/dashboard/teacher/classes/${
                                data?.class_id?._id
                              }/${encodeURIComponent(data?.class_id?.level)}/subjects/${
                                data?.subject?._id
                              }/set-obj-questions`,
                            )
                          }
                        >
                          Set OBJ Questions
                        </Button>
                      )}

                      {action_from === "class_teacher" && (
                        <>
                          <SubmitButton
                            disabled={isGeneratingClassPositions}
                            loading={isGeneratingClassPositions}
                            text="Generate Positions"
                            onSubmit={() =>
                              generateClassPositions({
                                class_id: data?._id,
                              })
                            }
                            type="button"
                          />

                          <Button
                            onClick={() => router.push(`class_managing/${data?._id}/students`)}
                            type="button"
                          >
                            View Students
                          </Button>

                          <Button
                            onClick={() =>
                              router.push(`class_managing/${data?._id}/exam_timetable`)
                            }
                            type="button"
                          >
                            Exam Timetables
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
