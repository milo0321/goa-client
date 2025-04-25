export interface BaseStoreState<T> {
  items: T[];
  currentItem: T | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export type StoreActions<T, CreateT, UpdateT> = {
  fetchItems: (params?: any) => Promise<void>;
  getItem: (id: string) => Promise<void>;
  createItem: (data: CreateT) => Promise<void>;
  updateItem: (id: string, data: UpdateT) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setCurrentItem: (item: T | null) => void;
  resetError: () => void;
};