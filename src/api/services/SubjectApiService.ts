import { HttpClient } from "@/configs/http.config";
import { AddSubjectToClassDto, CreateSubjectDto } from "../dtos/SubjectDto";
import { subjectRoutes } from "@/constants/routes/subjectRoutes";

export class SubjectApiService {
  public static async createASubject(requestBody: CreateSubjectDto) {
    const response = await HttpClient.getClient().post(
      `${subjectRoutes.createASubject}`,
      requestBody,
    );
    return response.data;
  }

  public static async addSubjectToClass({
    requestBody,
    params,
  }: {
    requestBody: AddSubjectToClassDto;
    params: {
      class_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${subjectRoutes.addSubjectToClass}/${params.class_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async getAllClassSubjectsByClassId(class_id: string) {
    const response = await HttpClient.getClient().get(
      `${subjectRoutes.getAllClassSubjectsByClassId}/${class_id}`,
    );
    return response.data;
  }

  public static async getAllSubjects() {
    const response = await HttpClient.getClient().get(`${subjectRoutes.getAllSubjects}`);
    return response.data;
  }

  public static async getASubjectById(subject_id: string) {
    const response = await HttpClient.getClient().get(
      `${subjectRoutes.getASubjectById}/${subject_id}`,
    );
    return response.data;
  }

  public static async getJssSubjects() {
    const response = await HttpClient.getClient().get("/api/v1/subjects/get-all-jss-subjects");
    return response.data;
  }

  public static async getSssCompulsorySubjects() {
    const response = await HttpClient.getClient().get(
      "/api/v1/subjects/get-all-compulsory-subjects",
    );
    return response.data;
  }

  public static async getSssOptionalSubjects() {
    const response = await HttpClient.getClient().get("/api/v1/subjects/get-all-optional-subjects");
    return response.data;
  }

  public static async getAllSubjectsInTiers() {
    const [jssSubjects, sssCompulsorySubjects, sssOptionalSubjects] = await Promise.all([
      this.getJssSubjects(),
      this.getSssCompulsorySubjects(),
      this.getSssOptionalSubjects(),
    ]);

    return {
      jssSubjects,
      sssCompulsorySubjects,
      sssOptionalSubjects,
    };
  }
}
