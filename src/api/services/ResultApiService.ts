import { HttpClient } from "@/configs/http.config";
import { resultRoutes } from "@/constants/routes/resultRoutes";
import {
  GenerateClassPositionDto,
  RecordAllStudentsExamScoreDto,
  RecordAllStudentsScoreDto,
  RecordLastTermCumulativeDto,
  RecordStudentScoreDto,
  StudentPositionGradingDto,
  StudentTermResultDto,
} from "../dtos/ResultDto";

export class ResultApiService {
  public static async getResultSetting() {
    const response = await HttpClient.getClient().get(`${resultRoutes.getResultSetting}`);
    return response.data;
  }

  public static async getLevelResultSetting(pathParams: { level: string }) {
    const response = await HttpClient.getClient().get(
      `${resultRoutes.getLevelResultSetting}/${pathParams?.level}`,
    );
    return response.data;
  }

  public static async recordStudentScorePerTerm(requestBody: RecordStudentScoreDto) {
    const response = await HttpClient.getClient().put(
      `${resultRoutes.recordStudentScorePerTerm}`,
      requestBody,
    );
    return response.data;
  }

  public static async recordAllStudentsExamScoresPerTerm(
    requestBody: RecordAllStudentsExamScoreDto,
  ) {
    const response = await HttpClient.getClient().put(
      `${resultRoutes.recordAllStudentsExamScoresPerTerm}`,
      requestBody,
    );
    return response.data;
  }

  public static async recordAllStudentsScoresPerTerm(requestBody: RecordAllStudentsScoreDto) {
    const response = await HttpClient.getClient().put(
      `${resultRoutes.recordAllStudentsScoresPerTerm}`,
      requestBody,
    );
    return response.data;
  }

  public static async getStudentTermResultInASchool(params: StudentTermResultDto) {
    const response = await HttpClient.getClient().get(
      `${resultRoutes.getStudentTermResultInASchool}/${params.student_id}/${params.academic_session_id}/${params.term}`,
    );
    return response.data;
  }

  public static async subjectPositionGradingInClassInASchool(params: StudentPositionGradingDto) {
    const response = await HttpClient.getClient().put(
      `${resultRoutes.subjectPositionGradingInClassInASchool}/${params.class_enrolment_id}/${params.subject_id}`,
    );
    return response.data;
  }

  public static async recordAllStudentsLastTermCumPerTermInASchool(
    requestBody: RecordLastTermCumulativeDto,
  ) {
    const response = await HttpClient.getClient().put(
      `${resultRoutes.recordAllStudentsLastTermCumPerTermInASchool}`,
      requestBody,
    );
    return response.data;
  }

  public static async generateClassPositionForStudents(params: GenerateClassPositionDto) {
    const response = await HttpClient.getClient().put(
      `${resultRoutes.generateClassPositionForStudents}/${params.class_id}`,
    );
    return response.data;
  }

  public static async getAllResultsOfAStudent(student_id: string) {
    const response = await HttpClient.getClient().get(
      `${resultRoutes.getAllResultsOfAStudent}/${student_id}`,
    );
    return response.data;
  }

  public static async getStudentResultByResultIdInASchool(pathParams: {
    student_id: string;
    result_id: string;
  }) {
    const response = await HttpClient.getClient().get(
      `${resultRoutes.getStudentResultByResultIdInASchool}/${pathParams.student_id}/${pathParams.result_id}`,
    );
    return response.data;
  }

  public static async getAllSubjectResultOfStudentsInClass() {
    const response = await HttpClient.getClient().get(
      `${resultRoutes.getAllSubjectResultOfStudentsInClass}`,
    );
    return response.data;
  }
}
