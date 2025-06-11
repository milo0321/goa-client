import {
  createEntity,
  deleteEntity,
  fetchEntities,
  fetchEntity,
  updateEntity
} from '@/api/request';
import { CreateEmailAccount, EmailAccount, UpdateEmailAccount } from '../types/email.types';

import { PaginationParams } from '@/types/base';

const ENDPOINT = '/emails/accounts';

export const fetchEmailAccount = (params?: PaginationParams) =>
  fetchEntities<EmailAccount>(ENDPOINT, params);

export const getEmailAccount = (id: string) => fetchEntity<EmailAccount>(`${ENDPOINT}/${id}`);

export const createEmailAccount = (data: CreateEmailAccount) =>
  createEntity<EmailAccount, CreateEmailAccount>(ENDPOINT, data);

export const updateEmailAccount = (id: string, data: UpdateEmailAccount) =>
  updateEntity<EmailAccount, UpdateEmailAccount>(`${ENDPOINT}/${id}`, data);

export const deleteEmailAccount = (id: string) => deleteEntity(`${ENDPOINT}/${id}`);
