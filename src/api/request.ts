import apiClient from './client';
import { PaginatedResponse } from '@/types/base';

// 通用 GET 列表（分页）
export const fetchEntities = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<PaginatedResponse<T>> => {
  return await apiClient.get(endpoint, { params });
};

// 通用 GET 单个实体
export const fetchEntity = async <T>(endpoint: string): Promise<T> => {
  return await apiClient.get(endpoint);
};

// 通用 POST 创建
export const createEntity = async <T, U>(endpoint: string, data: U): Promise<T> => {
  return await apiClient.post(endpoint, data);
};

// 通用 PUT 更新
export const updateEntity = async <T, U>(endpoint: string, data: U): Promise<T> => {
  return await apiClient.put(endpoint, data);
};

// 通用 DELETE
export const deleteEntity = async (endpoint: string): Promise<void> => {
  await apiClient.delete(endpoint);
};
