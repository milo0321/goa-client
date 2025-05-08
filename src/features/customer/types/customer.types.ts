import { BaseEntity, PaginationParams, PaginatedResponse, ApiResponse } from '../../../types/base';

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
}

// 创建DTO
export interface CreateCustomer {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
}

// 更新DTO
export interface UpdateCustomer extends Partial<CreateCustomer> { }

// 特定于客户的分页参数
export interface CustomerPaginationParams extends PaginationParams {
  sortBy?: keyof Customer;
  name?: string;
  email?: string;
}

// 类型导出
export type {
  PaginationParams,      // 保留基础导出
  PaginatedResponse,     // 保留基础导出
  ApiResponse           // 保留基础导出
};