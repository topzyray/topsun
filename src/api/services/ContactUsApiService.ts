import { HttpClient } from "@/configs/http.config";
import { contactUsRoutes } from "@/constants/routes/contactUsRoutes";
import { CreateContactUsDto } from "../dtos/ContactUsDto";

export class ContactUsApiService {
  public static async createContactUs(requestBody: CreateContactUsDto) {
    const response = await HttpClient.getClient().post(
      `${contactUsRoutes.createContactUs}`,
      requestBody,
    );
    return response.data;
  }

  public static async getAllContactUs(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${contactUsRoutes.getAllContactUs}`, {
      params: queryParams,
    });
    return response.data;
  }

  public static async getContactUsById(contact_id: string) {
    const response = await HttpClient.getClient().get(
      `${contactUsRoutes.getContactUsById}/${contact_id}`,
    );
    return response.data;
  }
}
