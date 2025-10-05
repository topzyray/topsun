import { HttpClient } from "@/configs/http.config";
import { busStopRoutes } from "@/constants/routes/busStopRoutes";

export class AddressApiService {
  public static async addBusStop(formData: { bus_stop: string; group: string }) {
    const response = await HttpClient.getClient().post(
      "/api/v1/addresses/add-bus-stop-to-database",
      formData,
    );
    return response.data;
  }

  public static async addManyBusStops(formData: { bus_stops: string[]; group: string }) {
    const response = await HttpClient.getClient().post(
      "/api/v1/addresses/add-many-bus-stops-to-database",
      formData,
    );
    return response.data;
  }

  public static async getAllBusStops(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(`${busStopRoutes.getAllBusStops}`, {
      params: queryParams,
    });
    return response.data;
  }

  public static async getBusStopById(bus_stop_id: string) {
    const response = await HttpClient.getClient().get(
      `/api/v1/addresses/get-bus-stop-by-id/${bus_stop_id}`,
    );
    return response.data;
  }
}
