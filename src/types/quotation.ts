import { BaseEntity, PaginationParams, PaginatedResponse, ApiResponse } from './base';
import { Customer } from './customer';

// 运输方式定价
export interface QuantityPrice {
  quantity: number;                   // 数量（如5000/10000）
  unitPrice: number;                  // 单价
  currency?: string;                  // 货币类型（默认USD）
}

// 数量阶梯定价
export interface QuotePrice {
  method: 'air' | 'ship' | 'express'; // 运输方式
  terms?: string;                     // 条款（如CNF FOB）
  destination?: string;               // 目的地（如Germany)
  prices: QuantityPrice[];         // 不同数量的价格
}

// 附加费用
export interface AdditionalFee {
  feeType: 'sampling' | 'mold' | 'certification' | string; // 费用类型
  amount: number;                     // 金额
  refundable: boolean;                // 是否可返还
  conditions?: string;                // 返还条件（如"order >10000pcs"）
}

export interface PackingField {
  value?: string;
  unit?: string;
}

export interface SizeField {
  length?: string;
  width?: string;
  height?: string;
  unit?: string;
}

export interface PackingDetail {
  innerPack?: PackingField;
  outerPack?: PackingField;
  cartonSize?: SizeField;
  weight?: PackingField;
}

export type ProductionTimeValue = {
  type: 'exact' | 'range';
  from: number;
  to?: number; // only present if type is 'range'
  unit: 'days' | 'months';
};

// 主报价单实体
export interface Quotation extends BaseEntity {
  inquiryDate: string;                // ISO 8601格式
  customerId: string;
  customer?: Customer;                // 关联查询时可用
  client: string;
  article: string;
  size: string;
  material: string;
  color: string;
  details: string;
  branding: string;
  packing: string;
  quantity: string;
  certifications: string;
  price: string;
  extraCost: string;
  sampleTime: ProductionTimeValue;
  massTime: ProductionTimeValue;
  quotePrices: QuotePrice[];        // 多数量阶梯报价
  additionalFees?: AdditionalFee[];     // 附加费用
  packingMethods?: PackingDetail[];     // 打包方式
  status: 'draft' | 'quoted' | 'ordered' | 'canceled'; // 报价状态
  notes?: string;
}

// 创建DTO
export interface CreateQuotation {
  customerId: string;
  productName: string;
  client: string;
  article: string;
  size: string;
  material: string;
  color: string;
  details: string;
  branding: string;
  packing: string;
  quantity: string;
  certifications: string;
  quantityType: 'single' | 'multiple';
  quotePrices: Omit<QuotePrice, 'prices'>[]; // 创建时无需价格
  additionalFees?: Omit<AdditionalFee, 'id'>[];
  notes?: string;
}

// 更新/报价DTO
export interface UpdateQuotation {
  productName?: string;
  client: string;
  article: string;
  size: string;
  material: string;
  color: string;
  details: string;
  branding: string;
  packing: string;
  quantity: string;
  certifications: string;
  sampleTime: ProductionTimeValue;
  massTime: ProductionTimeValue;
  quotePrices: QuotePrice[];        // 多数量阶梯报价
  additionalFees?: AdditionalFee[];     // 附加费用
  packingMethods?: PackingDetail[];     // 打包方式
  status?: 'draft' | 'quoted' | 'ordered' | 'canceled';
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
export type FeeType = AdditionalFee['feeType'];