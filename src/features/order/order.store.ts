import { create } from 'zustand';
import * as api from './order.api';
import { createResourceStore } from '@/utils/createResourceStore';
import {
  Order,
  CreateOrder,
  UpdateOrder,
  OrderItem,
  CostItem
} from './order.types';
import { ResourceStore } from '@/types/base';
import { StateCreator } from 'zustand/vanilla';

type OrderStore = ResourceStore<Order> & {
  orderItems: OrderItem[];
  costItems: CostItem[];
  setOrderItems: (items: OrderItem[]) => void;
  addOrderItem: (item: OrderItem) => void;
  updateOrderItem: (index: number, item: Partial<OrderItem>) => void;
  removeOrderItem: (index: number) => void;

  setCostItems: (items: CostItem[]) => void;
  addCostItem: (item: CostItem) => void;
  updateCostItem: (index: number, item: Partial<CostItem>) => void;
  removeCostItem: (index: number) => void;
};

const orderStoreCreator: StateCreator<
  OrderStore,
  [],
  [],
  OrderStore
> = (set, get, apiStore) => {
  const baseStore = createResourceStore<Order, CreateOrder, UpdateOrder>({
    fetchAll: api.fetchOrders,
    fetchOne: api.getOrder,
    create: api.createOrder,
    update: api.updateOrder,
    delete: api.deleteOrder
  })(set, get, apiStore);

  return {
    ...baseStore,

    orderItems: [],
    costItems: [],

    setOrderItems: (items) => set({ orderItems: items }),
    addOrderItem: (item) => set((state) => ({ orderItems: [...state.orderItems, item] })),
    updateOrderItem: (index, updatedFields) =>
      set((state) => {
        const updated = [...state.orderItems];
        updated[index] = { ...updated[index], ...updatedFields };
        return { orderItems: updated };
      }),
    removeOrderItem: (index) =>
      set((state) => {
        const updated = [...state.orderItems];
        updated.splice(index, 1);
        return { orderItems: updated };
      }),

    setCostItems: (items) => set({ costItems: items }),
    addCostItem: (item) => set((state) => ({ costItems: [...state.costItems, item] })),
    updateCostItem: (index, updatedFields) =>
      set((state) => {
        const updated = [...state.costItems];
        updated[index] = { ...updated[index], ...updatedFields };
        return { costItems: updated };
      }),
    removeCostItem: (index) =>
      set((state) => {
        const updated = [...state.costItems];
        updated.splice(index, 1);
        return { costItems: updated };
      }),
  };
};

export const useOrderStore = create<OrderStore>()(orderStoreCreator);
