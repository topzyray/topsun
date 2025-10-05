import { HttpClient } from "@/configs/http.config";
import {
  ChangeClassTeacherDto,
  ChangeSubjectTeacherDto,
  OnboardTeacherDto,
  StudentsClassOfferingDto,
  StudentsTeacherManagesDto,
  TeacherSubjectAssignmentDto,
  TeacherToClassDto,
} from "../dtos/TeacherDto";
import { teacherRoutes } from "@/constants/routes/teacherRoutes";

export class TeacherApiService {
  public static async assignTeacherToSubjectInSchool(requestBody: TeacherSubjectAssignmentDto) {
    const response = await HttpClient.getClient().put(
      `${teacherRoutes.assignTeacherToSubject}`,
      requestBody,
    );
    return response.data;
  }

  public static async assignTeacherToClass(requestBody: TeacherToClassDto) {
    const response = await HttpClient.getClient().put(
      `${teacherRoutes.assignTeacherToClass}`,
      requestBody,
    );
    return response.data;
  }

  public static async changeSubjectTeacherInClass(requestBody: ChangeSubjectTeacherDto) {
    const response = await HttpClient.getClient().put(
      `${teacherRoutes.changeSubjectTeacherInClass}`,
      requestBody,
    );
    return response.data;
  }

  public static async changeClassTeacher({
    requestBody,
    params,
  }: {
    requestBody: ChangeClassTeacherDto;
    params: {
      class_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${teacherRoutes.changeClassTeacher}/${params.class_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async getTeacherById(teacher_id: string) {
    const response = await HttpClient.getClient().get(
      `${teacherRoutes.getTeacherById}/${teacher_id}`,
    );
    return response.data;
  }

  public static async getTeachersBySubjectId(
    subject_id: string,
    queryParams: Record<string, any> = {},
  ) {
    const response = await HttpClient.getClient().get(
      `${teacherRoutes.getTeachersBySubjectId}/${subject_id}`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getTeachers(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${teacherRoutes.getTeachers}`, {
      params: queryParams,
    });
    return response.data;
  }

  public static async onboardTeacherById({
    requestBody,
    params,
  }: {
    requestBody: OnboardTeacherDto;
    params: {
      teacher_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${teacherRoutes.onboardTeacherById}/${params.teacher_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async getAllClassesTeacherTeachesByTeacherId({
    params,
  }: {
    params: {
      teacher_id: string;
    };
  }) {
    const response = await HttpClient.getClient().get(
      `${teacherRoutes.getAllClassesTeacherTeachesByTeacherId}/${params.teacher_id}`,
    );
    return response.data;
  }

  public static async getStudentsInClassOfferingTeacherSubject(params: StudentsClassOfferingDto) {
    const response = await HttpClient.getClient().get(
      `${teacherRoutes.getStudentsInClassOfferingTeacherSubject}/${params.academic_session_id}/${params.class_id}/${params.subject_id}`,
    );
    return response.data;
  }

  public static async getClassTeacherManages(params: { teacher_id: string }) {
    const response = await HttpClient.getClient().get(
      `${teacherRoutes.getClassTeacherManages}/${params.teacher_id}`,
    );
    return response.data;
  }

  public static async getStudentsInClassThatTeacherManagesInASchool(
    params: StudentsTeacherManagesDto,
    queryParams: Record<string, any> = {},
  ) {
    const response = await HttpClient.getClient().get(
      `${teacherRoutes.getStudentsInClassThatTeacherManagesInASchool}/${params.teacher_id}/${params.class_id}/${params.academic_sesison_id}`,
      { params: queryParams },
    );
    return response.data;
  }
}
