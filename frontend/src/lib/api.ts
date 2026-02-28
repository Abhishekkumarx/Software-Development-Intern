import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Add response interceptor to throw descriptive errors from backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);

export interface EquipmentTypeResponse {
  id: number;
  name: string;
}

export interface EquipmentResponse {
  id: number;
  name: string;
  type: EquipmentTypeResponse;
  status: string;
  lastCleanedDate: string | null;
}

export interface EquipmentRequest {
  name: string;
  typeId: number;
  status: string;
  lastCleanedDate?: string | null;
}

export interface MaintenanceLogResponse {
  id: number;
  equipmentId: number;
  maintenanceDate: string;
  notes: string;
  performedBy: string;
}

export interface MaintenanceLogRequest {
  equipmentId: number;
  maintenanceDate: string;
  notes: string;
  performedBy: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const fetchEquipment = async (
  status?: string, 
  search?: string, 
  page: number = 0, 
  size: number = 10
): Promise<PaginatedResponse<EquipmentResponse>> => {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.append('status', status);
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await api.get(`/equipment?${params.toString()}`);
  return response.data;
};

export const fetchMetrics = async (): Promise<{ total: number; active: number; inactive: number; maintenance: number }> => {
  const response = await api.get('/equipment/metrics');
  return response.data;
};

export const fetchEquipmentTypes = () => api.get<EquipmentTypeResponse[]>('/equipment/types').then(res => res.data);
export const createEquipment = (data: EquipmentRequest) => api.post<EquipmentResponse>('/equipment', data).then(res => res.data);
export const updateEquipment = (id: number, data: EquipmentRequest) => api.put<EquipmentResponse>(`/equipment/${id}`, data).then(res => res.data);
export const deleteEquipment = (id: number) => api.delete(`/equipment/${id}`);

export const fetchMaintenanceLogs = (equipmentId: number) => api.get<MaintenanceLogResponse[]>(`/equipment/${equipmentId}/maintenance`).then(res => res.data);
export const createMaintenanceLog = (data: MaintenanceLogRequest) => api.post<MaintenanceLogResponse>('/maintenance', data).then(res => res.data);

export default api;
