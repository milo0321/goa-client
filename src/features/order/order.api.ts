import {
  CostItem,
  CreateOrder,
  Order,
  OrderItem,
  OrderPaginationParams,
  UpdateCostItem,
  UpdateOrder,
  UpdateOrderItem
} from './order.types';

import {
  createEntity,
  deleteEntity,
  fetchEntities,
  fetchEntity,
  updateEntity
} from '@/api/request';

const BASE_URL = '/orders';

/**
 * 获取订单列表（支持分页、筛选）
 */
export const fetchOrders = (params?: OrderPaginationParams) =>
  fetchEntities<Order>(BASE_URL, params);

/**
 * 获取订单详情
 */
export const getOrder = (id: string) => fetchEntity<Order>(`${BASE_URL}/${id}`);

/**
 * 创建订单（包含子项）
 */
export const createOrder = (data: CreateOrder) => createEntity<Order, CreateOrder>(BASE_URL, data);

/**
 * 更新订单（包含子项）
 */
export const updateOrder = (id: string, data: UpdateOrder) =>
  updateEntity<Order, UpdateOrder>(`${BASE_URL}/${id}`, data);

/**
 * 删除订单
 */
export const deleteOrder = (id: string) => deleteEntity(`${BASE_URL}/${id}`);

/**
 * 获取订单商品项
 */
export const fetchOrderItems = (orderId: string) =>
  fetchEntities<OrderItem>(`${BASE_URL}/${orderId}/items`);

export const updateOrderItem = (orderId: string, item: UpdateOrderItem) =>
  updateEntity<OrderItem, UpdateOrderItem>(`/orders/${orderId}/items/${item.id}`, item);

export const deleteOrderItem = (orderId: string, itemId: string) =>
  deleteEntity(`/orders/${orderId}/items/${itemId}`);

/**
 * 获取订单成本项
 */
export const fetchCostItems = (orderId: string) =>
  fetchEntities<CostItem>(`${BASE_URL}/${orderId}/costs`);

export const updateCostItem = (orderId: string, item: UpdateCostItem) =>
  updateEntity<CostItem, UpdateCostItem>(`/orders/${orderId}/costs/${item.id}`, item);

export const deleteCostItem = (orderId: string, itemId: string) =>
  deleteEntity(`/orders/${orderId}/costs/${itemId}`);
