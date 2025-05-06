import { BaseEntity, PaginationParams, PaginatedResponse, ApiResponse } from './base';
import { Customer } from './customer';

// 运输方式定价
export interface ShippingPrice {
  method: 'air' | 'ship' | 'express'; // 运输方式
  unitPrice: number;                  // 单价
  currency?: string;                  // 货币类型（默认USD）
  terms?: string;                     // 条款（如CNF Germany）
}

// 数量阶梯定价
export interface QuantityTier {
  quantity: number;                   // 数量（如5000/10000）
  prices: ShippingPrice[];            // 不同运输方式的价格
}

// 附加费用
export interface AdditionalFee {
  feeType: 'sampling' | 'mold' | 'certification' | string; // 费用类型
  amount: number;                     // 金额
  refundable: boolean;                // 是否可返还
  conditions?: string;                // 返还条件（如"order >10000pcs"）
}

// 主报价单实体
export interface Quotation extends BaseEntity {
  inquiryDate: string;                // ISO 8601格式
  customerId: string;
  customer?: Customer;                // 关联查询时可用
  productName: string;
  quantityType: 'single' | 'multiple'; // 询价类型
  quantityTiers: QuantityTier[];      // 多数量阶梯报价
  status: 'draft' | 'quoted' | 'ordered' | 'canceled'; // 报价状态
  notes?: string;
  additionalFees?: AdditionalFee[];    // 附加费用
}

// 创建DTO
export interface CreateQuotation {
  customerId: string;
  productName: string;
  quantityType: 'single' | 'multiple';
  quantityTiers: Omit<QuantityTier, 'prices'>[]; // 创建时无需价格
  additionalFees?: Omit<AdditionalFee, 'id'>[];
  notes?: string;
}

// 更新/报价DTO
export interface UpdateQuotation {
  productName?: string;
  quantityTiers?: QuantityTier[];     // 更新时包含价格
  status?: 'draft' | 'quoted' | 'ordered' | 'canceled';
  additionalFees?: AdditionalFee[];
  notes?: string;
}

// 报价响应DTO（用于前端展示）
export interface QuotationResponse extends Quotation {
  totalPrice: number;                 // 计算后的总价
  shippingOptions: string[];          // 可用的运输方式
}

// 分页查询参数
export interface QuotationPaginationParams extends PaginationParams {
  sortBy?: keyof Quotation;
  status?: 'draft' | 'quoted' | 'ordered' | 'canceled'; // 过滤状态
  productName?: string;
  customerId?: string;
  dateRange?: [string, string];       // 询价日期范围
}

// 类型导出
export type {
  PaginationParams,
  PaginatedResponse,
  ApiResponse
};

// 实用类型
export type ShippingMethod = ShippingPrice['method'];
export type FeeType = AdditionalFee['feeType'];