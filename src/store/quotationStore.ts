import { create } from 'zustand';
import * as api from '../api/quotation';
import { createResourceStore } from '../lib/createResourceStore';
import { 
  Quotation, 
  CreateQuotation, 
  UpdateQuotation,
  QuantityTier,
  AdditionalFee
} from '../types/quotation';
import { ResourceStore } from '../types/base';
import { StateCreator } from 'zustand/vanilla';

type QuotationStore = ResourceStore<Quotation> & {
  submitQuotation: (id: string, priceData: {
    quantityTiers: QuantityTier[];
    additionalFees?: AdditionalFee[];
  }) => Promise<void>;
  calculatePrice: (params: {
    quantity: number;
    shippingMethod: 'air' | 'ship';
  }) => Promise<number>;
};

const quotationStoreCreator: StateCreator<
  QuotationStore,
  [],
  [],
  QuotationStore
> = (set, get, apiStore) => {
  const baseStore = createResourceStore<Quotation, CreateQuotation, UpdateQuotation>({
    fetchAll: api.fetchQuotations,
    fetchOne: api.getQuotation,
    create: api.createQuotation,
    update: api.updateQuotation,
    delete: api.deleteQuotation
  })(set, get, apiStore);

  return {
    ...baseStore,

    // 提交报价（带多阶梯价格）
    submitQuotation: async (id, { quantityTiers, additionalFees }) => {
      set({ loading: true, error: null });
      try {
        const updated = await api.submitQuotation(id, { 
          quantityTiers,
          additionalFees,
          status: 'quoted' 
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
    //     await api.patch(`/quotations/${id}/quote`, quoteData);
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

export const useQuotationStore = create<QuotationStore>()(quotationStoreCreator);