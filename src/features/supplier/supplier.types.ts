import { BaseEntity, PaginationParams, PaginatedResponse, ApiResponse } from '../../types/base';

export interface Supplier extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
}

// 创建DTO
export interface CreateSupplier {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
}

// 更新DTO
export type UpdateSupplier = Partial<CreateSupplier>

// 特定于客户的分页参数
export interface SupplierPaginationParams extends PaginationParams {
  sortBy?: keyof Supplier;
  name?: string;
  email?: string;
}

// 类型导出
export type {
  PaginationParams,      // 保留基础导出
  PaginatedResponse,     // 保留基础导出
  ApiResponse           // 保留基础导出
};