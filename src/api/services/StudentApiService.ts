import { HttpClient } from "@/configs/http.config";
import { studentRoutes } from "@/constants/routes/studentRoutes";
import { LinkStudentParentDto, UpdateStudentSessionSubscriptionDto } from "../dtos/StudentDto";

export class StudentApiService {
  public static async linkSchoolStudentWithParent(requestBody: LinkStudentParentDto) {
    const response = await HttpClient.getClient().post(
      `${studentRoutes.linkSchoolStudentWithParent}`,
      requestBody,
    );
    return response.data;
  }

  public static async getAllStudentInASchool(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${studentRoutes.getAllStudentsInASchool}`, {
      params: queryParams,
    });
    return response.data;
  }

  public static async getStudentByIdInASchool(student_id: string) {
    const response = await HttpClient.getClient().get(
      `${studentRoutes.getAStudentByIdInASchool}/${student_id}`,
    );
    return response.data;
  }

  public static async updateStudentDetailsInASchool({
    responseBody,
    params,
  }: {
    responseBody?: FormData;
    params: {
      student_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${studentRoutes.updateStudentDetailsInASchool}/${params.student_id}`,
      responseBody,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  }

  public static async studentsSubscribeToNewSessionInASchool() {
    const response = await HttpClient.getClient().post(
      `${studentRoutes.studentsSubscribeToNewSessionInASchool}`,
    );
    return response.data;
  }

  public static async updateStudentSessionSubscriptionInASchool(
    requestBody: UpdateStudentSessionSubscriptionDto,
  ) {
    const response = await HttpClient.getClient().put(
      `${studentRoutes.updateStudentSessionSubscriptionInASchool}/${requestBody.student_id}/${requestBody.academic_session_id}`,
      {
        new_session_subscription_status: requestBody.new_session_subscription_status,
      },
    );
    return response.data;
  }

  public static async getNewStudentWithoutEnrollmentInASchool(
    queryParams: Record<string, any> = {},
  ) {
    const response = await HttpClient.getClient().get(
      `${studentRoutes.getNewStudentsWithoutClassEnrolmentBeforeInASchool}`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getStudentsSubscribedToNewSessionInASchool(level: string) {
    const response = await HttpClient.getClient().get(
      `${studentRoutes.getStudentsSubscribedToNewSessionInASchool}/${level}`,
    );
    return response.data;
  }

  public static async getAllStudentsOnAClassLevelInASchool(level: string) {
    const response = await HttpClient.getClient().get(
      `${studentRoutes.getAllStudentsOnAClassLevelInASchool}/${level}`,
    );
    return response.data;
  }

  public static async getStudentsThatAreYetToSubscribedToNewSession(
    queryParams: Record<string, any> = {},
  ) {
    const response = await HttpClient.getClient().get(
      `${studentRoutes.getStudentsThatAreYetToSubscribedToNewSession}`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async provisionAccount(student_id: string) {
    const response = await HttpClient.getClient().put(
      `${studentRoutes.provisionAccount}/${student_id}`,
    );
    return response.data;
  }
}
