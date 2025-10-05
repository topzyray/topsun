import { HttpClient } from "@/configs/http.config";

export class ParentApiService {
  public static async fetchLinkedStudentSchool(student_id: string) {
    const response = await HttpClient.getClient().get(
      `/api/v1/parents/parent-fetch-student/${student_id}`,
    );
    return response.data;
  }

  public static async getAllLinkedStudentsInSchools(parent_id: string) {
    const response = await HttpClient.getClient().get(
      `/api/v1/parents/parent-fetch-children/${parent_id}`,
    );
    return response.data;
  }

  public static async getParentByIdInSchool(parent_id: string) {
    const response = await HttpClient.getClient().get(`/api/v1/parents/get-a-parent/${parent_id}`);
    return response.data;
  }

  public static async getAllParentsInSchool(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get("/api/v1/parents/get-all-parents", {
      params: queryParams,
    });
    return response.data;
  }
}
