import { HttpClient } from "@/configs/http.config";
import { sessionRoutes } from "@/constants/routes/sessionRoutes";
import { DeleteTermDto, EndTermDto, NewTermDto } from "../dtos/SessionDto";

export class SessionApiService {
  public static async createSessionForSchool() {
    const response = await HttpClient.getClient().post(
      `${sessionRoutes.createNewSessionForASchool}`,
    );
    return response.data;
  }

  public static async createTermForASchool({
    requestBody,
    params,
  }: {
    requestBody: NewTermDto;
    params: {
      session_id: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `${sessionRoutes.createNewTermForASchool}/${params.session_id}/create-term`,
      requestBody,
    );
    return response.data;
  }

  public static async getSessionsForASchool() {
    const response = await HttpClient.getClient().get(`${sessionRoutes.getAllSessionsForASchool}`);
    return response.data.sessions;
  }

  public static async getSessionByIdForASchool(session_id: string) {
    const response = await HttpClient.getClient().get(
      `${sessionRoutes.getASessionBySessionIdForASchool}/${session_id}`,
    );
    return response.data;
  }

  public static async endSessionByIdForASchool(session_id: string) {
    const response = await HttpClient.getClient().put(
      `${sessionRoutes.endASessionBySessionIdForASchool}/${session_id}`,
    );
    return response.data;
  }

  public static async endTermInASessionByIdForASchool(params: EndTermDto) {
    const response = await HttpClient.getClient().put(
      `${sessionRoutes.endATermInASessionByTermIdForASchool}/${params.session_id}/${params.term_id}`,
    );
    return response.data;
  }

  public static async getActiveSessionForSchool() {
    const response = await HttpClient.getClient().get(`${sessionRoutes.getSchoolActiveSession}`);
    return response.data;
  }

  public static async deleteSessionByIdForASchool(session_id: string) {
    const response = await HttpClient.getClient().delete(
      `${sessionRoutes.deleteSessionByIdForASchool}/${session_id}`,
    );
    return response.data;
  }

  public static async deleteTermByIdForASchool(params: DeleteTermDto) {
    const response = await HttpClient.getClient().delete(
      `${sessionRoutes.deleteTermByIdForASchool}/${params.session_id}/delete-term/${params.term_id}`,
    );
    return response.data;
  }
}
