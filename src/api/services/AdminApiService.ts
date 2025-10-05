import { HttpClient } from "@/configs/http.config";
import { schoolAdminRoutes } from "@/constants/routes/schoolAdminRoutes";
import { AdminUpdateStudentSessionSubscriptionDto } from "../dtos/SchoolAdminDto";

export class AdminApiService {
  public static async getAdminByAdminIdInMySchool(admin_id: string) {
    const response = await HttpClient.getClient().get(
      `${schoolAdminRoutes.getAdminByAdminIdInMySchool}/${admin_id}`,
    );
    return response.data;
  }

  public static async getAllAdminsInMySchool() {
    const response = await HttpClient.getClient().get(
      `${schoolAdminRoutes.getAllAdminsInMySchool}`,
    );
    return response.data;
  }

  public static async adminUpdateStudentSessionSubscriptionInASchool(
    requestBody: AdminUpdateStudentSessionSubscriptionDto,
  ) {
    const response = await HttpClient.getClient().put(
      `${schoolAdminRoutes.adminUpdateStudentSessionSubscriptionInASchool}/${requestBody.academic_session_id}`,
      {
        student_ids_array: requestBody.student_ids_array,
      },
    );
    return response.data;
  }

  public static async getMySchoolSummary() {
    const response = await HttpClient.getClient().get(`${schoolAdminRoutes.getMySchoolSummary}`);
    return response.data;
  }
}
