import { create } from 'zustand';
import * as api from '../api/quotation';
import { createResourceStore } from '../lib/createResourceStore';
import { Quotation, CreateQuotation, UpdateQuotation } from '../types/quotation';
import { ResourceStore } from '../types/base';
import { StateCreator } from 'zustand/vanilla';

type QuotationStore = ResourceStore<Quotation> & {
  submitQuotation: (id: string, price: number) => Promise<void>;
};

const quotationStoreCreator: StateCreator<
  QuotationStore,
  [],
  [],
  QuotationStore
> = (set, get, apiStore) => {
  return {
    ...createResourceStore<Quotation, CreateQuotation, UpdateQuotation>({
      fetchAll: api.fetchQuotations,
      fetchOne: api.getQuotation,
      create: api.createQuotation,
      update: api.updateQuotation,
      delete: api.deleteQuotation
    })(set, get, apiStore),

    submitQuotation: async (id: string, price: number) => {
      set({ loading: true, error: null });
      try {
        const updated = await api.submitQuotation(id, price);
        const state = get();
        set({
          items: state.items.map((q) => (q.id === id ? updated : q)),
          currentItem: state.currentItem?.id === id ? updated : state.currentItem,
          loading: false,
        });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Submit failed',
          loading: false,
        });
        throw err;
      }
    }
  };
};

export const useQuotationStore = create<QuotationStore>()(quotationStoreCreator);
