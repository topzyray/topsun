"use client";

import { Separator } from "@/components/ui/separator";
import React, { Fragment } from "react";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { ClassApiService } from "@/api/services/ClassApiService";
import { Class, Subject } from "../../../../../types";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import BackButton from "@/components/buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";
import { Button } from "@/components/ui/button";
import ModalComponent from "@/components/modals/base/modal-component";
import ChangeClassTeacher from "@/components/forms/school/admins/change-class-teacher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddSubjectToClass from "@/components/forms/school/admins/add-subject-to-class";
import { useRouter } from "next/navigation";

export default function ClassDetails({ params }: { params: Record<string, any> }) {
  const [openChangeClassForm, setOpenChangeClassTeacherForm] = React.useState(false);
  const [openAddSubjectForm, setOpenAddSubjectTeacherForm] = React.useState(false);

  const router = useRouter();

  const { data, isLoading, isError, error } = useCustomQuery(
    ["classById"],
    () => ClassApiService.getAClassById(params.class_id),
    { id: params.class_id },
  );

  const classData: Class = data?.class !== undefined && data?.class;

  let status_color;

  switch (classData?.class_teacher?.status) {
    case "active":
      status_color = "text-green-600";
      break;
    case "inactive":
      status_color = "text-gray-600";
      break;
    case "sacked":
      status_color = "text-red-600";
      break;
    case "resigned":
      status_color = "text-yellow-600";
      break;
    default:
      status_color = "";
      break;
  }

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Class Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching class details" />}

      {classData && classData !== null && (
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2>Class Details</h2>

              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell className="uppercase">{classData?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableCell className="uppercase">{classData?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableCell className="uppercase">{classData?.level}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableCell className="uppercase">{classData?.section}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableCell className="uppercase">{classData?.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Date Created</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(classData?.createdAt)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <div className="flex items-center justify-center gap-4">
                        <Button onClick={() => setOpenAddSubjectTeacherForm(true)}>
                          Add Subjects
                        </Button>
                        <Button onClick={() => setOpenChangeClassTeacherForm(true)}>
                          Change Class Teacher
                        </Button>
                        <Button
                          onClick={() =>
                            router.push(`${classData?._id}/exam_timetable/${classData?.level}`)
                          }
                        >
                          Exams Timetable
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Separator />

              <div className="space-y-2">
                <h3>Class Teacher Details:</h3>

                <Table className="border">
                  <TableBody>
                    {classData?.class_teacher && (
                      <>
                        <TableRow>
                          <TableHead>Full Name</TableHead>
                          <TableCell className="uppercase">
                            {`${TextHelper.capitalize(
                              classData?.class_teacher?.first_name,
                            )} ${TextHelper.capitalize(classData?.class_teacher?.last_name)}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableCell className="uppercase">
                            {classData?.class_teacher?.email}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Phone</TableHead>
                          <TableCell className="uppercase">
                            {classData?.class_teacher?.phone}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableCell className={`uppercase ${status_color}`}>
                            {classData?.class_teacher?.status}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Date Created</TableHead>
                          <TableCell className="uppercase">
                            {TextHelper.getFormattedDate(classData?.createdAt)}
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {!classData?.class_teacher && (
                      <TableRow>
                        <TableCell colSpan={2}>No class teacher assigned yet</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 lg:w-1/2">
              <div className="w-full space-y-3 rounded border p-4">
                <h2>All Offerable Subjects:</h2>

                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      {["S/N", "Subjects"].map((head) => (
                        <TableHead key={head}>{head}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData?.compulsory_subjects &&
                      classData?.compulsory_subjects.length > 0 &&
                      classData?.compulsory_subjects.map((subject: Subject, index) => {
                        return (
                          <TableRow key={subject._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell> {TextHelper.capitalize(subject.name)}</TableCell>
                          </TableRow>
                        );
                      })}

                    {classData?.compulsory_subjects.length === 0 && (
                      <TableRow>
                        <TableCell>No subject added yet</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="w-full space-y-3 rounded border p-4">
                <h2>Teachers/Subjects Assignment:</h2>

                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      {["S/N", "Subjects", "Taught By"].map((head) => (
                        <TableHead key={head} className="text-nowrap">
                          {head}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData?.teacher_subject_assignments.length > 0 &&
                      classData?.teacher_subject_assignments.map((assignment, index) => {
                        return (
                          <TableRow key={assignment._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="uppercase">{assignment?.subject?.name}</TableCell>
                            <TableCell className="uppercase">
                              {`${assignment.teacher.first_name} ${assignment.teacher.last_name}`}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    <TableRow>
                      {classData?.teacher_subject_assignments.length < 1 && (
                        <TableCell colSpan={3} className="text-sm">
                          No teacher/subject assignment added yet.
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* <div className="flex flex-col gap-4 w-full lg:w-1/2">
              <div className="border p-4 rounded w-full space-y-3">
                <h2>Teachers/Subjects Assignment:</h2>

                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      {["S/N", "Subjects", "Taught By"].map((head) => (
                        <TableHead key={head} className="text-nowrap">
                          {head}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData?.teacher_subject_assignments.length > 0 &&
                      classData?.teacher_subject_assignments.map(
                        (assignment, index) => {
                          return (
                            <TableRow key={assignment._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="uppercase">
                                {assignment?.subject?.name}
                              </TableCell>
                              <TableCell className="uppercase">
                                {`${assignment.teacher.first_name} ${assignment.teacher.last_name}`}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}

                    <TableRow>
                      {classData?.teacher_subject_assignments.length < 1 && (
                        <TableCell colSpan={3} className="text-sm">
                          No teacher/subject assignment added yet.
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div> */}
          </div>

          {/* Handle add subject to class */}
          <AddSubjectToClass
            open={openAddSubjectForm}
            class={classData}
            onClose={() => setOpenAddSubjectTeacherForm(false)}
            closeOnSuccess={() => setOpenAddSubjectTeacherForm(false)}
          />

          {/* Handle change class teacher */}
          <ModalComponent
            open={openChangeClassForm}
            onClose={() => setOpenChangeClassTeacherForm(false)}
          >
            <ChangeClassTeacher
              action_from="class"
              class_id={classData._id}
              onClose={() => setOpenChangeClassTeacherForm(false)}
              closeOnSuccess={() => setOpenChangeClassTeacherForm(false)}
            />
          </ModalComponent>
        </div>
      )}

      {isError && (
        <div className="bg-sidebar max-w-md space-y-3 rounded p-6 text-red-600">
          <p>{extractErrorMessage(error)}</p>
        </div>
      )}
    </div>
  );
}
