import axios from 'axios';
import { ApiResponse, PaginatedResponse } from '../types/base';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 通用GET请求
export const fetchEntities = async <T>(
  endpoint: string,
  params?: unknown
): Promise<PaginatedResponse<T>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<T>>>(endpoint, { params });
  // 返回完整的分页响应结构
  return response.data;
};

// 通用GET单个实体
export const fetchEntity = async <T>(endpoint: string): Promise<T> => {
  const response = await apiClient.get<ApiResponse<T>>(endpoint);
  return response.data;
};

// 通用POST创建
export const createEntity = async <T, U>(endpoint: string, data: U): Promise<T> => {
  const response = await apiClient.post<ApiResponse<T>>(endpoint, data);
  return response.data;
};

// 通用PATCH更新
export const updateEntity = async <T, U>(endpoint: string, data: U): Promise<T> => {
  const response = await apiClient.put<ApiResponse<T>>(endpoint, data);
  return response.data;
};

// 通用DELETE
export const deleteEntity = async (endpoint: string): Promise<void> => {
  await apiClient.delete<ApiResponse<void>>(endpoint);
};