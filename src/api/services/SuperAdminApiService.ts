import { CreateResultSettingsDto } from "../dtos/SchoolDto";
import { HttpClient } from "@/configs/http.config";
import { superAdminRoutes } from "@/constants/routes/superAdminRoutes";
import { CreateClassLevelsDto, CreatePaymentPriorityDto } from "../dtos/PaymentDto";

export class SuperAdminApiService {
  public static async createPaymentPriority({
    requestBody,
  }: {
    requestBody: CreatePaymentPriorityDto;
  }) {
    const response = await HttpClient.getClient().post(
      `${superAdminRoutes.createPaymentPriority}`,
      requestBody,
    );
    return response.data;
  }

  public static async createResultSettingInASchool({
    requestBody,
    params,
  }: {
    requestBody: CreateResultSettingsDto;
    params: {
      level: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `${superAdminRoutes.createResultSettingInASchool}/${params.level}`,
      requestBody,
    );
    return response.data;
  }

  public static async createClassLevels({ requestBody }: { requestBody: CreateClassLevelsDto }) {
    const response = await HttpClient.getClient().post(
      `${superAdminRoutes.createClassLevels}`,
      requestBody,
    );
    return response.data;
  }

  public static async getAllClassLevelsOfASchool() {
    const response = await HttpClient.getClient().get(
      `${superAdminRoutes.getAllClassLevelsOfASchool}`,
    );
    return response.data;
  }
}
