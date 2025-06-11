import {
  createEntity,
  deleteEntity,
  fetchEntities,
  fetchEntity,
  updateEntity
} from '@/api/request';
import {
  CreateCustomer,
  Customer,
  CustomerPaginationParams,
  UpdateCustomer
} from '../types/customer.types';

const ENDPOINT = '/customers';

export const fetchCustomers = (params?: CustomerPaginationParams) =>
  fetchEntities<Customer>(ENDPOINT, params);

export const getCustomer = (id: string) => fetchEntity<Customer>(`${ENDPOINT}/${id}`);

export const createCustomer = (data: CreateCustomer) =>
  createEntity<Customer, CreateCustomer>(ENDPOINT, data);

export const updateCustomer = (id: string, data: UpdateCustomer) =>
  updateEntity<Customer, UpdateCustomer>(`${ENDPOINT}/${id}`, data);

export const deleteCustomer = (id: string) => deleteEntity(`${ENDPOINT}/${id}`);
