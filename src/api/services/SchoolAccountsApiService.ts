import { HttpClient } from "@/configs/http.config";
import { CreateSchoolAccountDto } from "../dtos/SchoolAccountDto";
import { schoolAccountRoutes } from "@/constants/routes/schoolAccountRoutes";

export class SchoolAccountsApiService {
  public static async createSchoolAccount(responseBody: CreateSchoolAccountDto) {
    const response = await HttpClient.getClient().post(
      `${schoolAccountRoutes.createSchoolAccount}`,
      responseBody,
    );
    return response.data;
  }

  public static async getMySchoolAccounts() {
    const response = await HttpClient.getClient().get(`${schoolAccountRoutes.getMySchoolAccounts}`);
    return response.data;
  }
}
