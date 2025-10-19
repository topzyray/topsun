import { HttpClient } from "@/configs/http.config";
import { cbtRoutes } from "@/constants/routes/cbtRoutes";
import {
  classTeacherAuthorizeStudentsToWriteSubjectDto,
  createCutoffMinutesDto,
  createTermClassExamTimetableDto,
  createTermExamDto,
  setSubjectCbtObjQuestionsDto,
  submitSubjectCbtObjExamForAClassDto,
  updateSubjectCbtObjExamForAClassDto,
  updateSubjectCbtObjExamRemainingTimeForAClassDto,
  updateTermClassTimeTableDto,
} from "../dtos/CbtDto";

export class CbtApiService {
  public static async createCutoffMinutesForASchool({
    requestBody,
  }: {
    requestBody: createCutoffMinutesDto;
  }) {
    const response = await HttpClient.getClient().post(
      `${cbtRoutes.createCutoffMinutesForASchool}`,
      requestBody,
    );
    return response.data;
  }

  public static async createTermExamDocumentInASchool({
    requestBody,
    params,
  }: {
    requestBody: createTermExamDto;
    params: {
      academic_session_id: string;
      term: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `${cbtRoutes.createTermExamDocumentInASchool}/${params.academic_session_id}/${params.term}`,
      requestBody,
    );
    return response.data;
  }

  public static async setSubjectCbtObjQuestionsForAClassInASchool({
    requestBody,
    params,
  }: {
    requestBody: setSubjectCbtObjQuestionsDto;
    params: {
      academic_session_id: string;
      class_id: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `${cbtRoutes.setSubjectCbtObjQuestionsForAClassInASchool}/${params.academic_session_id}/${params.class_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async createTermClassExamTimetableInASchool({
    requestBody,
    params,
  }: {
    requestBody: createTermClassExamTimetableDto;
    params: {
      academic_session_id: string;
      class_id: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `${cbtRoutes.createTermClassExamTimetableInASchool}/${params.academic_session_id}/${params.class_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async startSubjectCbtObjCbtAssessmentForAClass(params: {
    subject_id: string;
    academic_session_id: string;
    class_id: string;
    term: string;
  }) {
    const response = await HttpClient.getClient().get(
      `${cbtRoutes.startSubjectCbtObjCbtAssessmentForAClass}/${params.subject_id}/${params.academic_session_id}/${params.class_id}/${params.term}`,
    );
    return response.data;
  }

  public static async classTeacherAuthorizeStudentsToWriteSubjectCbtInASchool({
    requestBody,
    params,
  }: {
    requestBody: classTeacherAuthorizeStudentsToWriteSubjectDto;
    params: {
      subject_id: string;
      academic_session_id: string;
      class_id: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `${cbtRoutes.classTeacherAuthorizeStudentsToWriteSubjectCbtInASchool}/${params.subject_id}/${params.academic_session_id}/${params.class_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async updateSubjectCbtObjExamRemainingTimeForAClassInASchool({
    requestBody,
    params,
  }: {
    requestBody: updateSubjectCbtObjExamRemainingTimeForAClassDto;
    params: {
      cbt_result_id: string;
      exam_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${cbtRoutes.updateSubjectCbtObjExamRemainingTimeForAClassInASchool}/${params.cbt_result_id}/${params.exam_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async updateSubjectCbtObjExamForAClassInASchool({
    requestBody,
    params,
  }: {
    requestBody: updateSubjectCbtObjExamForAClassDto;
    params: {
      cbt_result_id: string;
      exam_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${cbtRoutes.updateSubjectCbtObjExamForAClassInASchool}/${params.cbt_result_id}/${params.exam_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async submitSubjectCbtObjExamForAClassInASchool({
    requestBody,
    params,
  }: {
    requestBody: submitSubjectCbtObjExamForAClassDto;
    params: {
      cbt_result_id: string;
      exam_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${cbtRoutes.submitSubjectCbtObjExamForAClassInASchool}/${params.cbt_result_id}/${params.exam_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async getTermCbtAssessmentDocumentInASchool(params: {
    academic_session_id: string;
    term: string;
  }) {
    const response = await HttpClient.getClient().get(
      `${cbtRoutes.getTermCbtAssessmentDocumentInASchool}/${params.academic_session_id}/${params.term}`,
    );
    return response.data;
  }

  public static async getTermClassExamTimetable(params: {
    academic_session_id: string;
    class_id: string;
    term: string;
  }) {
    const response = await HttpClient.getClient().get(
      `${cbtRoutes.getTermClassExamTimetable}/${params.academic_session_id}/${params.class_id}/${params.term}`,
    );
    return response.data;
  }

  public static async getAllAssessmentDocument(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${cbtRoutes.getAllAssessmentDocument}`, {
      params: queryParams,
    });
    return response.data;
  }

  public static async getAssessmentDocumentById(params: { exam_document_id: string }) {
    const response = await HttpClient.getClient().get(
      `${cbtRoutes.getAssessmentDocumentById}/${params.exam_document_id}`,
    );
    return response.data;
  }

  public static async updateClassCbtTimetable({
    requestBody,
    params,
  }: {
    requestBody: updateTermClassTimeTableDto;
    params: {
      timetable_id: string;
      subject_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `${cbtRoutes.updateClassCbtTimetable}/${params.timetable_id}/${params.subject_id}`,
      requestBody,
    );
    return response.data;
  }
}
