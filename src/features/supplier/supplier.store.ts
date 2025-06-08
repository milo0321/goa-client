import { create } from 'zustand';
import * as api from './supplier.api';
import { createResourceStore } from '../../lib/createResourceStore';
import { Supplier, CreateSupplier, UpdateSupplier } from './supplier.types';
import { ResourceStore } from '../../types/base';
import { StateCreator } from 'zustand/vanilla';

// 定义扩展的SupplierStore类型
type SupplierStore = ResourceStore<Supplier> & {
  // searchSuppliers: (keyword: string) => Promise<void>;
  // 可以继续添加其他custom actions...
};

// 使用StateCreator明确类型
const supplierStoreCreator: StateCreator<
  SupplierStore,
  [],
  [],
  SupplierStore
> = (set, get, apiStore) => {
  return {
    // 基础CRUD操作通过createResourceStore生成
    ...createResourceStore<Supplier, CreateSupplier, UpdateSupplier>({
      fetchAll: api.fetchSuppliers,
      fetchOne: api.getSupplier,
      create: api.createSupplier,
      update: api.updateSupplier,
      delete: api.deleteSupplier
    })(set, get, apiStore),
  };
};

// 创建store实例
export const useSupplierStore = create<SupplierStore>()(supplierStoreCreator);