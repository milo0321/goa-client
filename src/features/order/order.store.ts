import { create } from 'zustand';
import * as api from './order.api';
import { createResourceStore } from '../../lib/createResourceStore';
import {
  Order,
  CreateOrder,
  UpdateOrder,
  QuotePrice,
  AdditionalFee
} from './order.types';
import { ResourceStore } from '../../types/base';
import { StateCreator } from 'zustand/vanilla';

type OrderStore = ResourceStore<Order> & {
  submitOrder: (id: string, priceData: {
    quotePrices: QuotePrice[];
    additionalFees?: AdditionalFee[];
  }) => Promise<void>;
  calculatePrice: (params: {
    quantity: number;
    shippingMethod: 'air' | 'ship';
  }) => Promise<number>;
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

    // 提交报价（带多阶梯价格）
    submitOrder: async (id, { quotePrices, additionalFees }) => {
      set({ loading: true, error: null });
      try {
        const updated = await api.submitOrder(id, {
          quotePrices,
          additionalFees,
        });
        set({
          items: get().items.map(q => q.id === id ? updated : q),
          currentItem: updated,
          loading: false
        });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Submission failed',
          loading: false
        });
        throw err;
      }
    },

    // quoteInquiry: async (id: string, quoteData: QuoteFormData) => {
    //   try {
    //     set({ loading: true });
    //     await api.patch(`/orders/${id}/quote`, quoteData);
    //     notification.success({ message: 'Quote submitted successfully' });
    //   } catch (error) {
    //     notification.error({ message: 'Quote submission failed' });
    //     throw error;
    //   } finally {
    //     set({ loading: false });
    //   }
    // },

    // 价格计算逻辑
    calculatePrice: async ({ quantity, shippingMethod }) => {
      const res = await api.calculatePrice({ quantity, shippingMethod });
      return res.price;
    }
  };
};

export const useOrderStore = create<OrderStore>()(orderStoreCreator);