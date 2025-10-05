import { HttpClient } from "@/configs/http.config";
import { CreateMandatoryFeesDto, CreateOptionalFeesDto, CreateSchoolFeesDto } from "../dtos/FeeDto";
import { feeRoutes } from "@/constants/routes/feeRoutes";

export class FeesApiService {
  public static async createSchoolFeesInASchool(requestBody: CreateSchoolFeesDto) {
    const response = await HttpClient.getClient().post(
      `${feeRoutes.createSchoolFeesInASchool}`,
      requestBody,
    );
    return response.data;
  }

  public static async createOptionalFeesInASchool(requestBody: CreateOptionalFeesDto) {
    const response = await HttpClient.getClient().put(
      `${feeRoutes.createOptionalFeesInASchool}`,
      requestBody,
    );
    return response.data;
  }

  public static async createMandatoryFeesInASchool(requestBody: CreateMandatoryFeesDto) {
    const response = await HttpClient.getClient().put(
      `${feeRoutes.createMandatoryFeesInASchool}`,
      requestBody,
    );
    return response.data;
  }

  public static async addOptionalFeeDuringTerm(
    requestBody: CreateOptionalFeesDto & {
      term: string;
    },
  ) {
    const response = await HttpClient.getClient().put(
      `${feeRoutes.addOptionalFeeDuringTerm}`,
      requestBody,
    );
    return response.data;
  }

  public static async addMandatoryFeeDuringTerm(
    requestBody: CreateMandatoryFeesDto & {
      term: string;
    },
  ) {
    const response = await HttpClient.getClient().put(
      `${feeRoutes.addMandatoryFeeDuringTerm}`,
      requestBody,
    );
    return response.data;
  }

  public static async getSchoolFeesInASchool(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${feeRoutes.getSchoolFeesInASchool}`, {
      params: queryParams,
    });
    return response.data;
  }

  public static async getMandatoryFeesInASchool(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${feeRoutes.getMandatoryFeesInASchool}`, {
      params: queryParams,
    });
    return response.data;
  }
  public static async getOptionalFeesInASchool(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${feeRoutes.getOptionalFeesInASchool}`, {
      params: queryParams,
    });
    return response.data;
  }

  public static async updateSchoolFeeById({
    formData,
    params,
  }: {
    formData: {
      amount: string;
    };
    params: {
      fee_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `/api/v1/fees/update-school-fee/${params.fee_id}`,
      formData,
    );
    return response.data;
  }
}
