"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultApiService } from "@/api/services/ResultApiService";
import { ResultSettingComponent, Student, TermResult } from "../../../../types";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { Separator } from "../../ui/separator";
import Image from "next/image";
import { TextHelper } from "@/helpers/TextHelper";
import TooltipComponent from "@/components/info/tool-tip";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import ErrorBox from "@/components/atoms/error-box";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ExamKeyTypeEnum } from "@/api/enums/ExamKeyTypeEnum";
import { envConfig } from "@/configs/env.config";

export interface ResultCard {
  academic_session: string;
  student: Student;
  term_result: TermResult;
}

export function ResultCard<T extends ResultCard>({ result_data }: { result_data: T }) {
  const {
    data: resultSettings,
    isLoading: isLoadingResultSetting,
    isError: isResultSettingError,
    error: resultSetttingError,
  } = useCustomQuery(["results", "teacherById", result_data?.student?.current_class_level], () =>
    ResultApiService.getLevelResultSetting({
      level: decodeURIComponent(result_data?.student?.current_class_level),
    }),
  );

  const resultSettingsComponents: ResultSettingComponent =
    resultSettings?.result_setting && resultSettings?.result_setting;

  return (
    <div className="w-full">
      {isLoadingResultSetting ? (
        <CircularLoader text="Loading result setting data" />
      ) : result_data !== null ? (
        <>
          <Card className="relative h-full w-full space-y-4 overflow-auto rounded-none border text-nowrap">
            {/* Watermarks */}
            <div
              className="absolute top-1/2 left-1/2 z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 transform rounded"
              style={{
                backgroundImage: `url('/images/logo.png')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                opacity: 0.07,
                pointerEvents: "none", // Ensure it doesn’t block interactions
              }}
            ></div>

            <CardHeader className="relative z-10 space-y-6">
              <div className="mx-auto mt-4 flex flex-col gap-4">
                <div>
                  <h1 className="text-center text-4xl font-bold uppercase">
                    {envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL}
                  </h1>
                </div>
                <div className="flex items-center justify-evenly gap-6 md:gap-14">
                  {/* School Logo */}
                  <div>
                    <div className="mx-auto my-3 h-20 w-20 md:h-24 md:w-24">
                      <Image
                        src={"/images/logo.png"}
                        alt={envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL + " " + "logo"}
                        width={150}
                        height={150}
                        className="h-full w-full rounded border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-center text-xs">
                      <p className="capitalize">
                        <span>Address: </span>
                        <span>{envConfig.NEXT_PUBLIC_SCHOOL_ADDRESS}</span>
                        <span>{envConfig.NEXT_PUBLIC_SCHOOL_CITY}, </span>
                        <span>{envConfig.NEXT_PUBLIC_SCHOOL_COUNTRY}.</span>
                      </p>
                      <p>
                        <span>Email: </span>
                        <span>{envConfig.NEXT_PUBLIC_SCHOOL_EMAIL}</span>
                      </p>
                      <p>
                        <span>Phone: </span>
                        <span>{envConfig.NEXT_PUBLIC_SCHOOL_PHONE}</span>
                      </p>
                    </div>
                    <div className="text-center font-bold uppercase">
                      <p>Academic Report</p>
                      <p>
                        <span>Academic Session: </span>
                        <span>{result_data?.academic_session}</span>
                      </p>
                      <p>
                        <span>Term: </span>
                        <span>{result_data?.term_result?.term.split("_").join(" ")}</span>
                      </p>
                      <p>
                        <span>Class: </span>
                        <span>{result_data?.student?.current_class_level}</span>
                      </p>
                    </div>
                  </div>
                  {/* Student picture */}
                  <div>
                    <div className="mx-auto my-3 h-20 w-20 md:h-24 md:w-24">
                      <Image
                        src={
                          (result_data?.student?.profile_image?.url as string) ??
                          "/images/placeholder.png"
                        }
                        alt={result_data?.student?.first_name + " " + "logo"}
                        width={150}
                        height={150}
                        className="h-full w-full rounded border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <CardDescription className="w-full overflow-auto">
                <div className="mx-auto flex w-full gap-4 sm:justify-center">
                  <div className="w-full max-w-sm">
                    <Table className="border">
                      <TableBody>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell className="font-bold uppercase">{`${result_data?.student?.first_name} ${result_data?.student?.last_name}`}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Address</TableCell>
                          <TableCell className="font-bold uppercase">
                            {result_data?.student?.home_address}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Date of Birth</TableCell>
                          <TableCell className="font-bold uppercase">
                            {TextHelper.getFormattedDate(result_data?.student?.dob as string)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="w-full max-w-sm">
                    <Table className="border">
                      <TableBody>
                        <TableRow>
                          <TableCell>Admission No</TableCell>
                          <TableCell className="font-bold uppercase">
                            {result_data?.student?.admission_number}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Gender</TableCell>
                          <TableCell className="font-bold uppercase">
                            {result_data?.student?.gender}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Overal Position</TableCell>
                          <TableCell className="font-bold uppercase">
                            {result_data?.term_result?.class_position ?? "Pending"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="relative z-10 space-y-6">
              <Table className="border text-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-nowrap">S/N</TableHead>
                    <TableHead className="text-nowrap">Subject</TableHead>

                    {resultSettingsComponents?.resultSettingExist?.components &&
                      resultSettingsComponents?.resultSettingExist?.components.length > 0 &&
                      resultSettingsComponents?.resultSettingExist?.components.map((header) => (
                        <TooltipComponent
                          key={header.name}
                          trigger={
                            <TableHead className="text-nowrap">
                              {header.name} ({header?.percentage}%)
                            </TableHead>
                          }
                          message={<span>{`Max Score = ${header.percentage}%`}</span>}
                        />
                      ))}

                    <TableHead className="text-nowrap">Exams</TableHead>

                    <TableHead className="text-nowrap">Total</TableHead>

                    <TooltipComponent
                      trigger={<TableHead className="text-nowrap">Last Term Cum.</TableHead>}
                      message={<span>Last Term Cumulative</span>}
                    />

                    <TooltipComponent
                      trigger={<TableHead className="">Cum. Average</TableHead>}
                      message={<span>Cumulative Average</span>}
                    />
                    <TableHead className="text-nowrap">Grade</TableHead>
                    <TableHead className="text-nowrap">Positon</TableHead>
                    <TableHead className="text-nowrap">Remark</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {result_data?.term_result?.subject_results !== undefined &&
                    result_data?.term_result?.subject_results.length > 0 &&
                    result_data?.term_result?.subject_results.map((subject, index) => (
                      <TableRow key={subject?._id}>
                        <TableCell className="capitalize">{index + 1}</TableCell>
                        <TableCell className="capitalize">{subject?.subject?.name}</TableCell>

                        {subject.scores &&
                          subject.scores.length > 0 &&
                          subject?.scores
                            .filter(
                              (score) =>
                                score?.key !== ExamKeyTypeEnum.OBJ &&
                                score?.key !== ExamKeyTypeEnum.THEORY,
                            )
                            .map((score) => (
                              <TableCell key={score?._id} className="">
                                {score?.score}
                              </TableCell>
                            ))}

                        <TableCell>{subject?.total_score}</TableCell>

                        <TableCell>{subject?.last_term_cumulative}</TableCell>
                        <TableCell>{subject?.cumulative_average}</TableCell>
                        <TableCell
                          className={`${
                            ["A", "B", "C"].includes(subject?.grade)
                              ? "text-green-500"
                              : ["D", "E"].includes(subject?.grade)
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        >
                          {subject?.grade}
                        </TableCell>
                        <TableCell className="">{subject?.subject_position}</TableCell>
                        <TableCell className="">{subject?.remark}</TableCell>
                      </TableRow>
                    ))}
                  <TableRow className="h-10"></TableRow>
                  <TableRow />
                  <TableRow>
                    <TableCell className="text-nowrap">Cumulative Score</TableCell>
                    <TableCell>{result_data?.term_result?.cumulative_score}</TableCell>
                  </TableRow>
                  <TableRow className="font-extrabold">
                    <TableCell className="text-nowrap">Class Position</TableCell>
                    <TableCell>{result_data?.term_result?.class_position ?? "Pending"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Separator />

              <div className="border p-2">
                <div className="flex justify-between text-xs text-wrap">
                  <div className="flex w-1/2 max-w-[18rem] justify-start gap-2">
                    <div>
                      <p>
                        <span>Class Teacher&apos;s Comments: </span>
                        <span className="uppercase underline">{`${result_data?.student?.first_name} ${result_data?.student?.last_name}`}</span>{" "}
                        is a good student.
                      </p>
                      <p>
                        <span>Principal&apos;s Comments: </span>
                        <span>Very good performance. However, there is room for improvement.</span>
                      </p>
                    </div>
                  </div>
                  {/* <div></div> */}
                  <div className="flex w-1/2 justify-end gap-2">
                    <div>
                      <p>Signature</p>
                      <p>E-Signed</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="absolute -top-3 left-1 text-xs">
              <div className="flex justify-between">
                <div>
                  <span>Generated on </span>
                  {`${TextHelper.getFormattedDate(
                    Date(),
                  )} at ${TextHelper.getFormattedTime(Date())}`}
                </div>
              </div>
            </div>
            <div className="absolute -top-3 right-1 text-xs">
              <div className="flex justify-between">
                <div>
                  <p className="uppercase">Student Result</p>
                </div>
              </div>
            </div>

            <div className="absolute top-3 right-1 z-10 text-xs">
              <TooltipComponent
                trigger={
                  <Button
                    size="icon"
                    variant="success"
                    className="text-white hover:cursor-not-allowed"
                    // onClick={() =>
                    //   generateReportCard({
                    //     ...result_data,
                    //     sessionData: activeSessionData,
                    //     studentData: student_data,
                    //   })
                    // }
                  >
                    <Download />
                  </Button>
                }
                message={<span>Coming Soon</span>}
              />
            </div>
          </Card>
        </>
      ) : isResultSettingError ? (
        <ErrorBox error={resultSetttingError} />
      ) : (
        <p>No result setting data available.</p>
      )}
    </div>
  );
}
