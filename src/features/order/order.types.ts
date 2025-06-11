import { BaseEntity } from '../../types/base';

export interface Order extends BaseEntity {
  id: string;
  orderNo: string;
  orderArticle: string;
  customerId: string;
  customerOrderNo: string;
  customerName: string;
  currency: string;
  paymentTerms: string;
  deliveryTime: string; // ISO 格式的 UTC 时间
  shippingMethod: string;
  remarks?: string;
  status?: string;
  packingDetails?: PackingDetail[];
  orderDate: string; // ISO 格式的 UTC 时间
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemNo: string;
  article: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  subtotal: number;
  vatAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CostItem {
  id: string;
  orderId: string;
  componentName: string;
  componentType: string; // "Material" | "Molding" | "Shipping" 等
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplierId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// 打包详情字段复用服务端结构
export interface PackingField {
  value?: number;
  unit?: string;
}

export interface SizeField {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}

export interface PackingDetail {
  bagPack?: PackingField;
  cartonPack?: PackingField;
  cartonSize?: SizeField;
  weight?: PackingField;
}

export interface OrderPaginationParams {
  page: number;
  limit: number;
  sortBy?: keyof Order;
  status?: string;
  customerId?: string;
  dateRange?: [string, string]; // [startDate, endDate]
}

export interface CreateOrder {
  orderNo: string;
  orderArticle: string;
  customerId: string;
  customerOrderNo: string;
  customerName: string;
  currency: string;
  paymentTerms: string;
  deliveryTime: string; // ISO 格式
  shippingMethod: string;
  orderDate: string; // ISO 格式
  remarks?: string;
  status?: string;
  packingDetails?: PackingDetail[];
  orderItems: CreateOrderItem[];
  costItems?: CreateCostItem[];
}

export interface UpdateOrder {
  orderNo?: string;
  orderArticle?: string;
  customerId?: string;
  customerOrderNo?: string;
  customerName?: string;
  currency?: string;
  paymentTerms?: string;
  deliveryTime?: string;
  shippingMethod?: string;
  orderDate?: string;
  remarks?: string;
  status?: string;
  packingDetails?: PackingDetail[];
  orderItems?: UpdateOrderItem[];
  costItems?: UpdateCostItem[];
}

export interface CreateOrderItem {
  itemNo: string;
  article: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
}

export interface UpdateOrderItem {
  id: string; // 必须有 ID 以识别更新目标
  itemNo?: string;
  article?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  vatRate?: number;
}

export interface CreateCostItem {
  componentName: string;
  componentType: string;
  quantity: number;
  unit: string;
  unitCost: number;
  supplierId?: string;
  remarks?: string;
}

export interface UpdateCostItem {
  id: string;
  componentName?: string;
  componentType?: string;
  quantity?: number;
  unit?: string;
  unitCost?: number;
  supplierId?: string;
  remarks?: string;
}