import { HttpClient } from "@/configs/http.config";
import { paymentRoutes } from "@/constants/routes/paymentRoutes";
import { AddFeeForStudentDto } from "../dtos/PaymentDto";

export class PaymentApiService {
  public static async addFeeToStudentPaymentDocumentInASchool({
    requestBody,
    params,
  }: {
    requestBody: AddFeeForStudentDto;
    params: { session_id: string };
  }) {
    const response = await HttpClient.getClient().put(
      `${paymentRoutes.addFeeToStudentPaymentDocumentInASchool}/${params.session_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async getPaymentPriorityForMySchool() {
    const response = await HttpClient.getClient().get(
      `${paymentRoutes.getPaymentPriorityForMySchool}`,
    );
    return response.data;
  }

  public static async createPaymentForAllStudents({
    requestBody,
    params,
  }: {
    requestBody: {
      term: string;
    };
    params: { session_id: string };
  }) {
    const response = await HttpClient.getClient().post(
      `/api/v1/payments/create-payment-document-with-only-school-fees/${params.session_id}`,
      requestBody,
    );
    return response.data;
  }

  public static async subscribeStudentToBusById({
    formData,
    params,
  }: {
    formData: {
      term: string;
      is_using: boolean;
      trip_type?: string;
      route?: string;
    };
    params: {
      session_id: string;
      student_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `/api/v1/payments/student-subscribe-to-bus/${params.session_id}/${params.student_id}`,
      formData,
    );
    return response.data;
  }

  public static async getAllPaymentsAwaitingApproval(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      "/api/v1/payments/get-all-payments-needing-approval",
      { params: queryParams },
    );
    return response.data;
  }

  public static async approveBankPaymentById({
    formData,
    params,
  }: {
    formData: {
      amount_paid: number;
      transaction_id: string;
      bank_name: string;
    };
    params: {
      payment_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `/api/v1/payments/approve-bank-payment/${params.payment_id}`,
      formData,
    );
    return response.data;
  }

  public static async getAllOutstandingPaymentsOfStudent(student_id: string) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-all-outstanding-payment-documents-of-a-student/${student_id}`,
    );
    return response.data;
  }

  public static async getStudentOutstandingPaymentById({
    params,
  }: {
    params: {
      student_id: string;
      payment_id: string;
    };
  }) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-a-payment-document-of-a-student/${params.student_id}/${params.payment_id}`,
    );
    return response.data;
  }

  public static async makeCashPayment({
    formData,
    params,
  }: {
    formData: {
      term: string;
      amount_paying: number;
      class_id: string;
      payment_method: string;
    };
    params: { session_id: string; student_id: string };
  }) {
    const response = await HttpClient.getClient().post(
      `/api/v1/payments/make-cash-payment/${params.session_id}/${params.student_id}`,
      formData,
    );
    return response.data;
  }

  public static async makeBankPayment({
    formData,
    params,
  }: {
    formData: {
      term: string;
      amount_paying: number;
      teller_number: string;
      bank_name: string;
      class_id: string;
    };
    params: {
      session_id: string;
      student_id: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `/api/v1/payments/make-bank-payment/${params.session_id}/${params.student_id}`,
      formData,
    );
    return response.data;
  }

  public static async makeCardPayment({
    formData,
    params,
  }: {
    formData: {
      term: string;
      amount_paying: number;
      class_id: string;
    };
    params: {
      session_id: string;
      student_id: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      `/api/v1/payments/make-card-payment/${params.session_id}/${params.student_id}`,
      formData,
    );
    return response.data;
  }

  public static async getCardPaymentStatus(params: { reference: string; student_id: string }) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/paystack-call-back/${params.reference}/${params.student_id}
    `,
    );
    return response.data;
  }

  public static async getStudentPaymentDocumentsByStudentId(
    queryParams: Record<string, any> = {},
    pathParams: {
      student_id: string;
    },
  ) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-student-payment-documents/${pathParams.student_id}`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getAllPaymentDocuments(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-all-payment-documents`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getPaymentsApprovalsByBursarId(
    queryParams: Record<string, any> = {},
    pathParams: {
      bursar_id: string;
    },
  ) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-all-payments-approved-by-bursar/${pathParams.bursar_id}`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getAllPaymentSummaries(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-all-payment-summary-fail-and-success`,
      { params: queryParams },
    );
    return response.data;
  }

  public static async getPaymentNeedingApprovalById(pathParams: { payment_id: string }) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-payment-document-needing-approval/${pathParams.payment_id}`,
    );
    return response.data;
  }

  public static async getPaymentTransactionHistoryForStudent(student_id: string) {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-payment-transaction-history-of-student/${student_id}`,
    );
    return response.data;
  }

  public static async getAllPaymentTransactionHistories() {
    const response = await HttpClient.getClient().get(
      `/api/v1/payments/get-all-payment-summary-fail-and-success`,
    );
    return response.data;
  }
}
