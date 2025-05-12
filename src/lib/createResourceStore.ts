import { StateCreator } from 'zustand';
import { ResourceStore, BaseEntity, PaginatedResponse } from '../types/base';

export function createResourceStore<T extends BaseEntity, CreateT, UpdateT>(
  api: {
    fetchAll: (params?: any) => Promise<PaginatedResponse<T>>;
    fetchOne: (id: string) => Promise<T>;
    create: (data: CreateT) => Promise<T>;
    update: (id: string, data: UpdateT) => Promise<T>;
    delete: (id: string) => Promise<void>;
  },
  options?: {
    defaultPagination?: { page: number; limit: number };
    initialData?: Partial<ResourceStore<T>>; // 新增初始化参数
  }
): StateCreator<ResourceStore<T>, [], [], ResourceStore<T>> {
  const defaultPagination = options?.defaultPagination || { page: 1, limit: 10 };

  return (set) => ({
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    pagination: { ...defaultPagination, total: 0 },
    initialized: false,

    fetchItems: async (params) => {
      if (params?.force) {
        set({ initialized: false }); // 重置状态强制刷新
      }
      set({ loading: true, error: null });
      try {
        const { data, page, limit, total } = await api.fetchAll(params);
        set({
          items: data,
          pagination: { page, limit, total },
          loading: false,
          initialized: true,
        });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Request failed',
          initialized: true,
          loading: false
        });
      }
    },

    getItem: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const item = await api.fetchOne(id);
        set({ currentItem: item, loading: false });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Request failed', loading: false });
      }
    },

    createItem: async (data: CreateT) => {
      set({ loading: true, error: null });
      try {
        const newItem = await api.create(data);
        set((state) => ({ items: [newItem, ...state.items], loading: false }));
        return newItem;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Create failed', loading: false });
        throw err;
      }
    },

    updateItem: async (id: string, data: UpdateT) => {
      set({ loading: true, error: null });
      try {
        const updated = await api.update(id, data);
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? updated : item)),
          currentItem: state.currentItem?.id === id ? updated : state.currentItem,
          loading: false,
        }));
        return updated;
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Update failed', loading: false });
        throw err;
      }
    },

    deleteItem: async (id: string) => {
      set({ loading: true, error: null });
      try {
        await api.delete(id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          currentItem: state.currentItem?.id === id ? null : state.currentItem,
          loading: false,
        }));
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Delete failed', loading: false });
        throw err;
      }
    },

    setCurrentItem: (item) => set({ currentItem: item }),
    resetError: () => set({ error: null }),
  });
}
