import { HttpClient } from "@/configs/http.config";

export class FeesApiServicePrevious {
  public static async createSchoolFee(formData: { class_level: string; amount: string }) {
    const response = await HttpClient.getClient().post("/api/v1/fees/create-school-fees", formData);
    return response.data;
  }

  public static async createBusFee(formData: {
    close_group: {
      both_trips: string;
      single_trip: string;
    };
    far_group: {
      both_trips: string;
      single_trip: string;
    };
  }) {
    const response = await HttpClient.getClient().post(
      "/api/v1/fees/create-school-bus-fee",
      formData,
    );
    return response.data;
  }

  public static async getSchoolFees() {
    const response = await HttpClient.getClient().get("/api/v1/fees/get-all-school-fees");
    return response.data;
  }

  public static async getBusFee() {
    const response = await HttpClient.getClient().get("/api/v1/fees/get-school-bus");
    return response.data;
  }

  public static async getSchoolFeeById(school_fee_id: string) {
    const response = await HttpClient.getClient().get(
      `/api/v1/fees/get-school-fee/${school_fee_id}`,
    );
    return response.data;
  }

  public static async getBusFeeByGroup(paramsData: { group: string }) {
    const response = await HttpClient.getClient().get("/api/v1/fees/school-bus-by-group", {
      params: paramsData,
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

  public static async updateBusFeeById({
    formData,
    params,
  }: {
    formData: {
      close_group: {
        both_trips: string;
        single_trip: string;
      };
      far_group: {
        both_trips: string;
        single_trip: string;
      };
    };
    params: {
      fee_id: string;
    };
  }) {
    const response = await HttpClient.getClient().put(
      `/api/v1/fees/update-school-bus-fee/${params.fee_id}`,
      formData,
    );
    return response.data;
  }
}
