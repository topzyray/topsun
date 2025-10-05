"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Teacher } from "../../../../../types";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import AssignTeacherToClass from "../../../forms/school/admins/asign-teacher-to-class";
import AssignTeacherToSubject from "../../../forms/school/admins/asign-teacher-to-subject";
import TeacherOnboardingForm from "./teacher-onboarding";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import BackButton from "@/components/buttons/BackButton";
import ModalComponent from "@/components/modals/base/modal-component";
import ErrorBox from "@/components/atoms/error-box";
import { TextHelper } from "@/helpers/TextHelper";
import ChangeClassTeacher from "@/components/forms/school/admins/change-class-teacher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TeacherDetails({ params }: { params: Record<string, any> }) {
  const [openOnboardingForm, setOpenOnboardingForm] = useState(false);
  const [openAssignTeacherToClassForm, setOpenAssignTeacherToClassForm] = useState(false);
  const [openAssignTeacherToSubjectForm, setOpenAssignTeacherToSubjectForm] = useState(false);
  const [openChangeClassForm, setOpenChangeClassTeacherForm] = useState(false);

  let { data, isLoading, isError, error } = useCustomQuery(
    ["teacherById"],
    () => TeacherApiService.getTeacherById(params.teacher_id),
    { id: params.teacher_id },
  );

  let teacherData: Teacher = data?.teacher !== undefined && data?.teacher;

  let status_color: string;

  switch (teacherData?.status) {
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
      <h1 className="text-lg uppercase">Teacher Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching teacher details" />}

      {teacherData && teacherData !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2>Teacher Details</h2>

              <Table className="border">
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell className="uppercase">{teacherData?._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Verified</TableHead>
                    <TableCell
                      className={`uppercase ${
                        teacherData.is_verified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {teacherData?.is_verified ? "Yes" : "No"}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell className={`uppercase ${status_color}`}>
                      {teacherData?.status ? "Active" : "Inactive"}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableCell className="uppercase">{teacherData?.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableCell className="uppercase">{teacherData?.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Name</TableHead>
                    <TableCell className="uppercase">{teacherData?.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Middle Name</TableHead>
                    <TableCell className="uppercase">
                      {teacherData?.middle_name || "not set"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Date of Birth</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(teacherData?.dob as string)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Gender</TableHead>
                    <TableCell className="uppercase">{teacherData?.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableCell>{teacherData?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Phone</TableHead>
                    <TableCell className="uppercase">{teacherData?.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Employment Date</TableHead>
                    <TableCell className="uppercase">
                      {TextHelper.getFormattedDate(teacherData?.employment_date as string)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => setOpenOnboardingForm(true)}>Onboard</Button>
                        <Button
                          onClick={() => setOpenAssignTeacherToClassForm(true)}
                          disabled={!!teacherData?.class_managing}
                        >
                          Assign To Class
                        </Button>
                        <Button onClick={() => setOpenAssignTeacherToSubjectForm(true)}>
                          Assign To Subject
                        </Button>
                        <Button onClick={() => setOpenChangeClassTeacherForm(true)}>
                          Change Class Managing
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="w-full space-y-3 rounded border p-4">
                <h2>Class Managing Details</h2>

                <Table className="border">
                  <TableBody>
                    {teacherData?.class_managing && (
                      <>
                        <TableRow>
                          <TableHead>Class Level</TableHead>
                          <TableCell className="uppercase">
                            {teacherData?.class_managing?.level}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Class Name</TableHead>
                          <TableCell className="uppercase">
                            {teacherData?.class_managing?.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Class Section</TableHead>
                          <TableCell className="uppercase">
                            {`"${teacherData?.class_managing?.section}"`}
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {!teacherData?.class_managing && (
                      <TableRow>
                        <TableCell colSpan={2}>Teacher is not managing class yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="w-full space-y-3 rounded border p-4">
                <h2>Subjects Capabilities</h2>

                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead>S/N</TableHead>
                      <TableHead>Subject Teaching</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherData.subjects_capable_of_teaching.length > 0 &&
                      teacherData?.subjects_capable_of_teaching.map((subject, index) => {
                        return (
                          <TableRow key={subject?._id} className="uppercase">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{subject?.name}</TableCell>
                          </TableRow>
                        );
                      })}

                    <TableRow>
                      {teacherData?.subjects_capable_of_teaching.length == 0 && (
                        <TableCell colSpan={2}>Teacher not onboarded yet</TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="w-full space-y-3 rounded border p-4">
                <h2>Class and Subject Assignment Details</h2>

                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      {["S/N", "Class", "Subject"].map((title, index) => (
                        <TableCell
                          key={title}
                          className={`${
                            index === 4 ? "text-nowrap" : index === 5 ? "text-nowrap" : ""
                          }`}
                        >
                          {title}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherData?.teaching_assignment.map((assignment, index) => {
                      return (
                        <TableRow key={assignment?._id} className="uppercase">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="text-nowrap">
                            {assignment?.class_id?.name}
                          </TableCell>
                          <TableCell className="text-nowrap">{assignment?.subject?.name}</TableCell>
                        </TableRow>
                      );
                    })}

                    <TableRow>
                      {teacherData?.teaching_assignment.length < 1 && (
                        <TableCell colSpan={3}>No subject assigned yet </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Component for onboarding teacher */}
            <ModalComponent
              open={openOnboardingForm}
              onClose={() => setOpenOnboardingForm(false)}
              className=""
            >
              <TeacherOnboardingForm
                teacher_id={teacherData._id}
                onClose={() => {
                  setOpenOnboardingForm(false);
                }}
                closeOnSuccess={() => {
                  setOpenOnboardingForm(false);
                }}
              />
            </ModalComponent>

            {/* Component for assigning teacher to class */}
            <ModalComponent
              open={openAssignTeacherToClassForm}
              onClose={() => setOpenAssignTeacherToClassForm(false)}
              className=""
            >
              <AssignTeacherToClass
                teacher_id={teacherData._id}
                onClose={() => {
                  setOpenAssignTeacherToClassForm(false);
                }}
                closeOnSuccess={() => {
                  setOpenAssignTeacherToClassForm(false);
                }}
              />
            </ModalComponent>

            {/* Component for assigning teacher to subject */}
            <ModalComponent
              open={openAssignTeacherToSubjectForm}
              onClose={() => setOpenAssignTeacherToSubjectForm(false)}
              className=""
            >
              <AssignTeacherToSubject
                teacher_data={teacherData}
                onClose={() => {
                  setOpenAssignTeacherToSubjectForm(false);
                }}
                closeOnSuccess={() => {
                  setOpenAssignTeacherToSubjectForm(false);
                }}
              />
            </ModalComponent>

            {/* Handle change class teacher */}
            <ModalComponent
              open={openChangeClassForm}
              onClose={() => setOpenChangeClassTeacherForm(false)}
            >
              <ChangeClassTeacher
                action_from="teacher"
                teacher_id={teacherData._id}
                onClose={() => setOpenChangeClassTeacherForm(false)}
                closeOnSuccess={() => setOpenChangeClassTeacherForm(false)}
              />
            </ModalComponent>
          </div>
        </div>
      )}

      {isError && <ErrorBox error={error} />}
    </div>
  );
}
