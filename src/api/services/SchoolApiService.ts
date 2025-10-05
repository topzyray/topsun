import { schoolRoutes } from "@/constants/routes/schoolRoutes";
import { HttpClient } from "@/configs/http.config";

export class SchoolApiService {
  public static async uploadSchoolLogo({ formData }: { formData: FormData }) {
    const response = await HttpClient.getClient().put(
      `${schoolRoutes.uploadSchoolLogo}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  }

  public static async uploadSchoolImage({ formData }: { formData: FormData }) {
    const response = await HttpClient.getClient().put(
      `${schoolRoutes.uploadSchoolImage}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  }

  public static async getASchoolBySubdomain(params: { subdomain: string }) {
    const response = await HttpClient.getClient().get(
      `${schoolRoutes.getASchoolBySubdomain}/${params.subdomain}`,
    );
    return response.data;
  }
}
