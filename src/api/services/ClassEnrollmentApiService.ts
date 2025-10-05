import { HttpClient } from "@/configs/http.config";
import {
  ManyStudentEnrollmentDto,
  SessionClassDto,
  StudentEnrollmentDto,
} from "../dtos/ClassEnrollmentDto";
import { classEnrollmentRoutes } from "@/constants/routes/classEnrollmentRoutes";

export class ClassEnrollmentApiService {
  public static async enrollStudentToClassInASchool(requestBody: StudentEnrollmentDto) {
    const response = await HttpClient.getClient().post(
      `${classEnrollmentRoutes.enrollStudentToAClassInASchool}`,
      requestBody,
    );
    return response.data;
  }

  public static async enrollManyStudentToClassInASchool(requestBody: ManyStudentEnrollmentDto) {
    const response = await HttpClient.getClient().post(
      `${classEnrollmentRoutes.enrollManyStudentsToClassInASchool}`,
      requestBody,
    );
    return response.data;
  }

  public static async getEnrollmentByIdInASchool(enrollment_id: string) {
    const response = await HttpClient.getClient().get(
      `${classEnrollmentRoutes.getASingleEnrollmentByIdInASchool}/${enrollment_id}`,
    );
    return response.data;
  }

  public static async getAllEnrollmentsInASchool(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${classEnrollmentRoutes.getAllEnrollmentsInASchool}`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getActiveClassEnrollmentsInASchool(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${classEnrollmentRoutes.getAllActiveClassEnrollmentsInASchool}`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getAllSessionEnrollmentsByIdInASchool(session_id: string) {
    const response = await HttpClient.getClient().get(
      `${classEnrollmentRoutes.getAllSessionEnrollmentsBySessionIdInASchool}/${session_id}`,
    );
    return response.data;
  }

  public static async getStudentsInClassInActiveSession(params: SessionClassDto) {
    const response = await HttpClient.getClient().get(
      `${classEnrollmentRoutes.getAllStudentsInAClassInActiveSessionInASchool}/${params.class_id}/${params.session_id}`,
    );
    return response.data;
  }

  public static async getAllStudentsInAClassInASchool(params: SessionClassDto) {
    const response = await HttpClient.getClient().get(
      `${classEnrollmentRoutes.getAllStudentsInAClassInASchool}/${params.class_id}/${params.session_id}`,
    );
    return response.data;
  }
}
