import { BaseEntity, PaginationParams, PaginatedResponse, ApiResponse } from './base';
import { Customer } from './customer';

export interface Quotation extends BaseEntity {
  inquiryDate: string; // ISO 8601格式
  customerId: string;
  customer?: Customer; // 关联查询时可用
  productName: string;
  quantity: number;
  status: 'pending' | 'quoted';
  quotedPrice?: number;
  quotedDate?: string;
  notes?: string;
}

// 创建DTO
export interface CreateQuotation {
  customerId: string;
  productName: string;
  quantity: number;
  notes?: string;
}

// 更新DTO
export interface UpdateQuotation {
  productName?: string;
  quantity?: number;
  status?: 'pending' | 'quoted';
  quotedPrice?: number;
  notes?: string;
}

// 特定于询价的分页参数
export interface QuotationPaginationParams extends PaginationParams {
  sortBy?: keyof Quotation;
  status?: 'pending' | 'quoted';
  productName?: string;
}

// 类型导出
export type {
  PaginationParams,      // 保留基础导出
  PaginatedResponse,     // 保留基础导出
  ApiResponse           // 保留基础导出
};