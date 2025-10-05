import { HttpClient } from "@/configs/http.config";
import { ClassApiService } from "./ClassApiService";
import { SchoolAccountsApiService } from "./SchoolAccountsApiService";

export class CommonApiService {
  public static async getClassesAndSubjects() {
    const [classesResponse, subjectsResponse] = await Promise.all([
      HttpClient.getClient().get("/api/v1/classes/get-classes"),
      HttpClient.getClient().get("/api/v1/subjects/get-all-subjects"),
    ]);
    return {
      classes: classesResponse.data.classes,
      subjects: subjectsResponse.data.subjects,
    };
  }

  public static async getStudentClassNewStudents() {
    const [studentResponse, classResponse] = await Promise.all([
      HttpClient.getClient().get("/api/v1/students/get-new-students"),
      HttpClient.getClient().get("/api/v1/classes/get-classes"),
    ]);
    return {
      students: studentResponse.data.students,
      classes: classResponse.data,
    };
  }

  public static async getStudentClassReturningStudents(params: { level: string }) {
    const [studentResponse, classResponse] = await Promise.all([
      HttpClient.getClient().get(
        `/api/v1/students/get-students-that-subscribed-to-new-session/${params.level}`,
      ),
      HttpClient.getClient().get("/api/v1/classes/get-classes"),
    ]);
    return {
      students: studentResponse.data.students,
      classes: classResponse.data.classes,
    };
  }

  public static async getClassAndSchoolAccount() {
    const [classResponse, schoolAccountResponse] = await Promise.all([
      ClassApiService.getAllClasses(),
      SchoolAccountsApiService.getMySchoolAccounts(),
    ]);
    return {
      classResponse,
      schoolAccountResponse,
    };
  }
}
