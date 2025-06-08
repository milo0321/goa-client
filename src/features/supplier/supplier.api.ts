import {
  fetchEntities,
  fetchEntity,
  createEntity,
  updateEntity,
  deleteEntity
} from '../../api/client.api';
import {
  Supplier,
  CreateSupplier,
  UpdateSupplier,
  SupplierPaginationParams
} from './supplier.types';

const ENDPOINT = '/suppliers';

export const fetchSuppliers = (
  params?: SupplierPaginationParams
) => fetchEntities<Supplier>(ENDPOINT, params);

export const getSupplier = (id: string) =>
  fetchEntity<Supplier>(`${ENDPOINT}/${id}`);

export const createSupplier = (data: CreateSupplier) =>
  createEntity<Supplier, CreateSupplier>(ENDPOINT, data);

export const updateSupplier = (id: string, data: UpdateSupplier) =>
  updateEntity<Supplier, UpdateSupplier>(`${ENDPOINT}/${id}`, data);

export const deleteSupplier = (id: string) =>
  deleteEntity(`${ENDPOINT}/${id}`);