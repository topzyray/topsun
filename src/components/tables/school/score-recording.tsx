"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import { GlobalContext } from "@/providers/global-state-provider";
import { ResultSettingComponent, Student, Subject, Teacher } from "../../../../types";
import { CircularLoader } from "../../loaders/page-level-loader";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { Separator } from "../../ui/separator";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { ResultApiService } from "@/api/services/ResultApiService";
import { useQueryClient } from "@tanstack/react-query";
import ComponentLevelLoader from "../../loaders/component-level-loader";
import { toast } from "react-hot-toast";
import { ScoreSchema } from "@/api/schemas/ScoreSchemas";
import ErrorBox from "@/components/atoms/error-box";
import TooltipComponent from "@/components/info/tool-tip";
import SubmitButton from "@/components/buttons/SubmitButton";

type ScoreFormData = z.infer<typeof ScoreSchema>;

export default function ScoreInputForm({ params }: { params: Record<string, any> }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExamScoreType, setIsExamScoreType] = useState(false);
  const { activeSessionData } = useContext(GlobalContext);
  const { userDetails } = useAuth();
  const teacher_data = (userDetails ?? {}) as Teacher;

  const queryClient = useQueryClient();

  let {
    data: resultSettings,
    isLoading: isLoadingResultSetting,
    isError: isResultSettingError,
    error: resultSetttingError,
  } = useCustomQuery(["results", "teacherById", params.class_level], () =>
    ResultApiService.getLevelResultSetting({
      level: decodeURIComponent(params.class_level),
    }),
  );

  let resultSettingsComponents: ResultSettingComponent =
    resultSettings?.result_setting && resultSettings?.result_setting;

  let { data, isLoading, isError, error } = useCustomQuery(
    ["students", params.class_id, params.subject_id],
    () =>
      TeacherApiService.getStudentsInClassOfferingTeacherSubject({
        academic_session_id: activeSessionData?.activeSession?._id as string,
        class_id: params.class_id,
        subject_id: params.subject_id,
      }),
    {},
    activeSessionData?.activeSession?._id !== undefined,
  );

  let studentsData: Student[] = useMemo(() => {
    return data?.students?.students ?? [];
  }, [data?.students?.students]);

  const subjectData: Subject | undefined = data?.students?.subject;
  const subjectTeacherData: Teacher | undefined = data?.students?.subject_teacher;
  const enrollmentId: string | undefined = data?.students?.class_enrolment_id;

  const StudentFormData = useMemo(() => {
    return studentsData.map((student) => {
      const result: Record<string, string | number> = {
        student_id: student?._id,
      };

      resultSettingsComponents?.flattenedComponents.forEach((setting) => {
        result[setting.name] =
          student?.subject_result?.scores?.find(
            (s: { score_name: string }) => s.score_name === setting.name,
          )?.score ?? "";
      });

      return result;
    });
  }, [studentsData, resultSettingsComponents?.flattenedComponents]);

  const form = useForm<ScoreFormData>({
    resolver: zodResolver(ScoreSchema),
    defaultValues: {
      scoreName: "",
      students: [],
    },
  });

  useEffect(() => {
    if (studentsData.length > 0) {
      const updatedStudentFormData = studentsData.map((student) => {
        const dynamicResult: Record<string, number | string> = {
          student_id: student?._id,
        };

        resultSettingsComponents?.flattenedComponents.forEach((setting) => {
          dynamicResult[setting.name] =
            student?.subject_result?.scores?.find(
              (s: { score_name: string }) => s.score_name === setting.name,
            )?.score ?? "";
        });

        return dynamicResult;
      });

      form.reset({
        scoreName: "",
        students: updatedStudentFormData,
      });
    }
  }, [studentsData, resultSettingsComponents, form]);

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const selectedScoreType = useWatch({ control, name: "scoreName" });

  useEffect(() => {
    const examsComponentArray =
      resultSettingsComponents?.resultSettingExist?.exam_components?.component.filter(
        (item) => item.name === selectedScoreType,
      );

    if (examsComponentArray && examsComponentArray.length > 0) {
      setIsExamScoreType(true);
    } else {
      setIsExamScoreType(false);
    }
  }, [resultSettingsComponents?.resultSettingExist?.exam_components?.component, selectedScoreType]);

  // let {
  //   mutate: recordScoreForSingleStudent,
  //   isPending: isRecordingScoreForSingleStudent,
  // } = useCustomMutation(ResultApiService.recordStudentScorePerTerm, {
  //   onSuccessCallback: () => {
  //     queryClient.invalidateQueries({ queryKey: ["students"] });
  //     queryClient.invalidateQueries({ queryKey: [params.class_id] });
  //     queryClient.invalidateQueries({ queryKey: [params.subject_id] });
  //     form.reset({
  //       scoreName: undefined,
  //       students: StudentFormData,
  //     });
  //   },
  // });

  let { mutate: recordScoresForMultipleStudents, isPending: isRecordingScoresForMultipleStudents } =
    useCustomMutation(ResultApiService.recordAllStudentsScoresPerTerm, {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: [params.class_id] });
        queryClient.invalidateQueries({ queryKey: [params.subject_id] });
        form.reset({
          scoreName: "",
          students: StudentFormData,
        });
      },
    });

  let {
    mutate: recordExamsScoresForMultipleStudents,
    isPending: isRecordingExamsScoresForMultipleStudents,
  } = useCustomMutation(ResultApiService.recordAllStudentsExamScoresPerTerm, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: [params.class_id] });
      queryClient.invalidateQueries({ queryKey: [params.subject_id] });
      form.reset({
        scoreName: undefined,
        students: StudentFormData,
      });
    },
  });

  const { mutate: recordLastTermCumulative, isPending: isRecordingLastTermCumulative } =
    useCustomMutation(ResultApiService.recordAllStudentsLastTermCumPerTermInASchool, {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: [params.class_id] });
        queryClient.invalidateQueries({ queryKey: [params.subject_id] });
      },
    });

  const onSubmit = async (data: ScoreFormData) => {
    if (!selectedScoreType) return;

    const filteredStudents = data.students.filter(
      (student) => student[selectedScoreType]?.toString().trim() !== "",
    );

    if (filteredStudents.length === 0) {
      toast.error("No valid scores entered.");
      return;
    }

    const payloadCommon = {
      teacher_id: teacher_data._id,
      class_id: params.class_id,
      class_enrolment_id: enrollmentId as string,
      session_id: activeSessionData.activeSession?._id as string,
      term: activeSessionData.activeTerm?.name as string,
      subject_id: params.subject_id,
      score_name: selectedScoreType, // now supports dynamic field names
    };

    if (isExamScoreType) {
      const payload = {
        ...payloadCommon,
        result_objs: filteredStudents.map((student) => ({
          student_id: student.student_id,
          score: Number(student[selectedScoreType]),
        })),
      };
      recordExamsScoresForMultipleStudents(payload);
    } else {
      const payload = {
        ...payloadCommon,
        result_objs: filteredStudents.map((student) => ({
          student_id: student.student_id,
          score: Number(student[selectedScoreType]),
        })),
      };
      recordScoresForMultipleStudents(payload);
    }

    // if (filteredStudents.length === 1) {
    //   const singlePayload = {
    //     ...payloadCommon,
    //     student_id: filteredStudents[0].student_id,
    //     score: Number(filteredStudents[0][selectedScoreType]),
    //   };
    //   recordScoreForSingleStudent(singlePayload);
    // } else {
    //   const multiplePayload = {
    //     ...payloadCommon,
    //     result_objs: filteredStudents.map((student) => ({
    //       student_id: student.student_id,
    //       score: Number(student[selectedScoreType]),
    //     })),
    //   };
    //   recordScoresForMultipleStudents(multiplePayload);
    // }
  };

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) =>
      `${student?.admission_number} ${student?.first_name} ${student?.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, studentsData]);

  // Handle grading
  let { mutate: gradePositions, isPending: isGradingPositions } = useCustomMutation(
    ResultApiService.subjectPositionGradingInClassInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: [params.class_id] });
        queryClient.invalidateQueries({ queryKey: [params.subject_id] });
      },
    },
  );

  // Disable untill all students have total scores
  // const allStudentHaveTotalScores = useMemo(() => {
  //   return studentsData.every((student) => student?.subject_result?.total_score);
  // }, [studentsData]);

  // Disable untill all students have last term cumulative
  const allStudentHaveLastTermCumulative = useMemo(() => {
    return studentsData.every((student) => student?.subject_result?.last_term_cumulative);
  }, [studentsData]);

  // Disable untill all students have last term cumulative
  const allStudentHavePosition = useMemo(() => {
    return studentsData.every((student) => student?.subject_result?.subject_position);
  }, [studentsData]);

  const [localScores, setLocalScores] = useState<Record<string, number>>({});

  // This handles record last term cumulative score
  const handleRecordLastTermCumulative = () => {
    const payload = {
      teacher_id: teacher_data._id,
      class_id: params.class_id,
      class_enrolment_id: enrollmentId as string,
      session_id: activeSessionData?.activeSession?._id as string,
      term: activeSessionData?.activeTerm?.name as string,
      subject_id: params.subject_id,
      last_term_cumulative_objs: studentsData.map((student) => ({
        student_id: student._id,
        score:
          localScores[student._id] !== undefined
            ? Number(localScores[student._id])
            : student.subject_result?.last_term_cumulative,
      })),
    };

    const missingScores = payload?.last_term_cumulative_objs.some((item) => item?.score == 0);

    if (missingScores) {
      toast.error("Please enter all last term cumulative scores before submitting.");
      return;
    }

    recordLastTermCumulative(payload);
  };

  return (
    <div className="mx-auto max-w-full">
      <div className="mb-4 rounded border p-4 text-sm shadow-md">
        {isLoading ? (
          <CircularLoader text="Loading teacher data" />
        ) : subjectTeacherData !== undefined && subjectData !== undefined ? (
          <div className="flex flex-col gap-6">
            <div className="w-full space-y-2 sm:w-1/2">
              <h2 className="uppercase">Teacher Details:</h2>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Full Name:</p>
                  <p className="capitalize">{`${subjectTeacherData?.first_name} ${subjectTeacherData?.last_name}`}</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <p>Email:</p>
                  <p>{subjectTeacherData?.email}</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <p>Subject:</p>
                  <p className="capitalize">{subjectData?.name}</p>
                </div>
              </div>
            </div>
          </div>
        ) : isError ? (
          <div className="text-left">
            <p className="text-red-600">{extractErrorMessage(error)}</p>
          </div>
        ) : (
          <div>
            <CircularLoader text="Please wait" />
          </div>
        )}
      </div>

      <div className="rounded border p-4 shadow-md">
        {isLoadingResultSetting ? (
          <CircularLoader text="Loading result settings" />
        ) : resultSettingsComponents && resultSettingsComponents?.flattenedComponents.length > 0 ? (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="">
              {studentsData && studentsData.length > 0 && (
                <div>
                  <div className="mb-4 max-w-sm">
                    <FormField
                      control={control}
                      name="scoreName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Score Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Score Name" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="capitalize">
                              {/* DETERMINE WHETHER TO RECORD OBJ, THEORY OR NONE */}
                              {resultSettingsComponents?.flattenedComponents
                                .filter((component) => component)
                                .map((setting) => (
                                  <SelectItem
                                    key={setting.name}
                                    value={setting.name}
                                    className="capitalize"
                                  >
                                    {setting.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full max-w-sm">
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4 w-full"
                    />
                  </div>
                </div>
              )}

              <Separator />

              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-nowrap">Admission No</TableHead>
                    <TableHead className="text-nowrap">Class</TableHead>
                    <TableHead className="text-nowrap">First Name</TableHead>
                    <TableHead className="text-nowrap">Last Name</TableHead>

                    {resultSettingsComponents?.flattenedComponents.map((header, index) => (
                      <TooltipComponent
                        key={index}
                        trigger={
                          <TableHead className="text-nowrap capitalize">
                            {header.name} ({header?.percentage}%)
                          </TableHead>
                        }
                        message={<span>{`Max Score = ${header.percentage}%`}</span>}
                      />
                    ))}

                    <TableHead className="text-nowrap">Total</TableHead>
                    <TooltipComponent
                      trigger={<TableHead className="text-nowrap">Last Cum.</TableHead>}
                      message={<span>Last Term Cummulative</span>}
                    />
                    <TooltipComponent
                      trigger={<TableHead className="text-nowrap">Cum. Avg.</TableHead>}
                      message={<span>Cummulative Average</span>}
                    />
                    <TableHead className="text-nowrap">Grade</TableHead>
                    <TableHead className="text-nowrap">Remark</TableHead>
                    <TableHead className="text-nowrap">Position</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="text-sm">
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={15}>
                        <CircularLoader
                          text="Loading student data"
                          parentClassName="w-full bg-transparent"
                        />
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents && filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <TableRow key={student._id}>
                        <TableCell className="font-thin text-nowrap capitalize">
                          {student?.admission_number}
                        </TableCell>
                        <TableCell className="font-thin text-nowrap capitalize">
                          {student?.current_class_level}
                        </TableCell>
                        <TableCell className="font-thin text-nowrap capitalize">
                          {student?.first_name}
                        </TableCell>
                        <TableCell className="font-thin text-nowrap capitalize">
                          {student?.last_name}
                        </TableCell>
                        {resultSettingsComponents?.flattenedComponents.map((setting, i) => (
                          <TableCell key={i} className="font-thin text-nowrap">
                            <FormField
                              name={`students.${index}.${setting.name}`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      disabled={
                                        Boolean(
                                          student?.subject_result &&
                                            student?.subject_result?.scores &&
                                            student?.subject_result?.scores[setting?.name],
                                        ) || selectedScoreType !== setting?.name
                                      }
                                      value={field.value ?? ""}
                                      onChange={field.onChange}
                                      className="w-[4.5rem] font-thin"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        ))}
                        <TableCell className="font-thin text-nowrap">
                          <Input
                            value={student?.subject_result?.total_score}
                            disabled
                            className="w-[4.5rem] font-thin"
                          />
                        </TableCell>
                        <TableCell className="font-thin text-nowrap">
                          <Input
                            value={
                              localScores[student._id] ??
                              student?.subject_result?.last_term_cumulative ??
                              ""
                            }
                            onChange={(e) => {
                              setLocalScores((prev) => ({
                                ...prev,
                                [student._id]: e.target.value as unknown as number,
                              }));
                            }}
                            disabled={allStudentHavePosition}
                            type="number"
                            className="w-[4.5rem] font-thin"
                          />
                        </TableCell>
                        <TableCell className="text-sm font-thin text-nowrap">
                          <Input
                            value={student?.subject_result?.cumulative_average ?? ""}
                            className="w-[4.5rem] text-sm font-thin"
                            readOnly
                            // disabled={allStudentHavePosition}
                          />
                        </TableCell>
                        <TableCell className="text-sm font-thin text-nowrap capitalize">
                          <Input
                            value={student?.subject_result?.grade ?? ""}
                            readOnly
                            className={`w-[4.5rem] font-thin ${
                              student?.subject_result?.grade === "A" ||
                              student?.subject_result?.grade === "B" ||
                              student?.subject_result?.grade === "C"
                                ? "text-green-600"
                                : student?.subject_result?.grade === "D"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          />
                        </TableCell>
                        <TableCell className="w-max text-sm font-thin text-nowrap">
                          <p
                            contentEditable={false}
                            className={`flex h-[2.2rem] w-full items-center rounded border px-3 ${
                              student?.subject_result?.remark === "Excellent" ||
                              student?.subject_result?.remark === "Very Good" ||
                              student?.subject_result?.remark === "Good"
                                ? "text-green-600"
                                : student?.subject_result?.remark === "Pass"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {student?.subject_result?.remark ?? ""}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm font-thin text-nowrap">
                          <Input
                            value={student?.subject_result?.subject_position ?? ""}
                            readOnly
                            className="w-[4.5rem] text-sm"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 w-full text-red-600">
                        {extractErrorMessage(error)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 w-full">
                        No student data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Separator />

              {studentsData && studentsData.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Button
                    className="capitalize"
                    type="submit"
                    disabled={
                      !isValid ||
                      !selectedScoreType ||
                      // isRecordingScoreForSingleStudent ||
                      isRecordingScoresForMultipleStudents ||
                      isRecordingExamsScoresForMultipleStudents
                    }
                  >
                    {
                      // isRecordingScoreForSingleStudent ||
                      isRecordingScoresForMultipleStudents ||
                      isRecordingExamsScoresForMultipleStudents ? (
                        <ComponentLevelLoader
                          loading={
                            // isRecordingScoreForSingleStudent ||
                            isRecordingScoresForMultipleStudents ||
                            isRecordingExamsScoresForMultipleStudents
                          }
                          size={8}
                        />
                      ) : (
                        `Record ${(selectedScoreType && selectedScoreType) ?? ""}`
                      )
                    }
                  </Button>

                  <SubmitButton
                    type="button"
                    onSubmit={handleRecordLastTermCumulative}
                    disabled={
                      allStudentHaveLastTermCumulative ||
                      isRecordingLastTermCumulative ||
                      allStudentHavePosition
                    }
                    loading={isRecordingLastTermCumulative}
                    text="Record Last Cum."
                  />

                  <SubmitButton
                    type="button"
                    onSubmit={() =>
                      gradePositions({
                        class_enrolment_id: enrollmentId as string,
                        subject_id: subjectData?._id as string,
                      })
                    }
                    disabled={
                      !allStudentHaveLastTermCumulative ||
                      isGradingPositions ||
                      allStudentHavePosition
                    }
                    loading={isGradingPositions}
                    text="Calculate Positions"
                  />
                </div>
              )}
            </form>
          </Form>
        ) : isResultSettingError ? (
          <ErrorBox error={resultSetttingError} />
        ) : null}
      </div>
    </div>
  );
}
