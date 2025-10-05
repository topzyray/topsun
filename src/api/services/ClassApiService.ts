import { HttpClient } from "@/configs/http.config";
import { CreateClassDto } from "../dtos/ClassDto";
import { classRoutes } from "@/constants/routes/classRoutes";

export class ClassApiService {
  public static async createAClass(responseBody: CreateClassDto) {
    const response = await HttpClient.getClient().post(`${classRoutes.createAClass}`, responseBody);
    return response.data;
  }

  public static async getAllClasses() {
    const response = await HttpClient.getClient().get(`${classRoutes.getAllClasses}`);
    return response.data;
  }

  public static async getAClassById(class_id: string) {
    const response = await HttpClient.getClient().get(`${classRoutes.getAClassById}/${class_id}`);
    return response.data;
  }

  public static async getSchoolClassLevel() {
    const response = await HttpClient.getClient().get(`${classRoutes.getSchoolClassLevel}`);
    return response.data;
  }
}
