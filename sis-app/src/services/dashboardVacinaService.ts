import { api } from "./api";
import { DashboardVacinaDTO } from "@/types/dashboardVacina";

export async function obterDashboardVacina(): Promise<DashboardVacinaDTO> {
  const response = await api.get("/dashboard/vacinas");
  return response.data;
}