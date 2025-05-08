import {
  fetchEntities,
  fetchEntity,
  createEntity,
  updateEntity,
  deleteEntity
} from '../../../api/client.api';
import {
  Quotation,
  CreateQuotation,
  UpdateQuotation,
  QuotationPaginationParams,
  QuotePrice,
  AdditionalFee
} from '../types/quotation.types';

const ENDPOINT = '/quotations';

// 获取报价单列表（带分页）
export const fetchQuotations = (params?: QuotationPaginationParams) =>
  fetchEntities<Quotation>(ENDPOINT, params);

// 获取单个报价单详情
export const getQuotation = (id: string) =>
  fetchEntity<Quotation>(`${ENDPOINT}/${id}`);

// 创建报价单（支持多阶梯和附加费用）
export const createQuotation = (data: CreateQuotation) =>
  createEntity<Quotation, CreateQuotation>(ENDPOINT, {
    ...data,
    status: 'draft' // 自动设置初始状态
  });

// 更新报价单基础信息
export const updateQuotation = (id: string, data: UpdateQuotation) =>
  updateEntity<Quotation, UpdateQuotation>(`${ENDPOINT}/${id}`, data);

// 提交报价（完整报价方案）
export const submitQuotation = (
  id: string,
  data: {
    quotePrices: QuotePrice[];
    additionalFees?: AdditionalFee[];
  }
) => updateEntity<Quotation, {
  quotePrices: QuotePrice[];
  additionalFees?: AdditionalFee[];
  status: 'quoted';
  quotedDate: string;
}>(`${ENDPOINT}/${id}/submit`, {
  ...data,
  status: 'quoted',
  quotedDate: new Date().toISOString()
});

// 价格计算服务
export const calculatePrice = (params: {
  productId?: string;
  quantity: number;
  shippingMethod: 'air' | 'ship';
}) => {
  return updateEntity<{
    price: number;
    currency: string
  }, typeof params>(
    `${ENDPOINT}/calculate-price`,
    params
  );
};

// 删除报价单
export const deleteQuotation = (id: string) =>
  deleteEntity(`${ENDPOINT}/${id}`);

// 导出报价单为PDF
export const exportQuotation = (id: string) => {
  return fetchEntity<{ url: string }>(`${ENDPOINT}/${id}/export`);
};