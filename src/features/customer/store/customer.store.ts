import { create } from 'zustand';
import * as api from '../api/customer.api';
import { createResourceStore } from '../../../lib/createResourceStore';
import { Customer, CreateCustomer, UpdateCustomer } from '../types/customer.types';
import { ResourceStore } from '../../../types/base';
import { StateCreator } from 'zustand/vanilla';

// 定义扩展的CustomerStore类型
type CustomerStore = ResourceStore<Customer> & {
  // searchCustomers: (keyword: string) => Promise<void>;
  // 可以继续添加其他custom actions...
};

// 使用StateCreator明确类型
const customerStoreCreator: StateCreator<
  CustomerStore,
  [],
  [],
  CustomerStore
> = (set, get, apiStore) => {
  return {
    // 基础CRUD操作通过createResourceStore生成
    ...createResourceStore<Customer, CreateCustomer, UpdateCustomer>({
      fetchAll: api.fetchCustomers,
      fetchOne: api.getCustomer,
      create: api.createCustomer,
      update: api.updateCustomer,
      delete: api.deleteCustomer
    })(set, get, apiStore),
  };
};

// 创建store实例
export const useCustomerStore = create<CustomerStore>()(customerStoreCreator);