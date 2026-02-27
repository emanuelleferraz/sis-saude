import { api } from './api';
import { DashboardCronicaDTO, DashboardEpidemiologicaDTO } from '@/types/dashboardDoenca';

export async function obterDashboardCronica(): Promise<DashboardCronicaDTO> {
  const response = await api.get('/dashboard/cronicas');
  return response.data;
}

export async function obterDashboardEpidemiologica(): Promise<DashboardEpidemiologicaDTO> {
  const response = await api.get('/dashboard/epidemiologicas');
  return response.data;
}