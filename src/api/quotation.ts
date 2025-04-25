import {
    fetchEntities,
    fetchEntity,
    createEntity,
    updateEntity,
    deleteEntity
} from './client';
import {
    Quotation,
    CreateQuotation,
    UpdateQuotation,
    QuotationPaginationParams
} from '../types/quotation';

const ENDPOINT = '/quotations';

export const fetchQuotations = (
    params?: QuotationPaginationParams
) => fetchEntities<Quotation>(ENDPOINT, params);

export const getQuotation = (id: string) =>
    fetchEntity<Quotation>(`${ENDPOINT}/${id}`);

export const createQuotation = (data: CreateQuotation) =>
    createEntity<Quotation, CreateQuotation>(ENDPOINT, data);

export const updateQuotation = (id: string, data: UpdateQuotation) =>
    updateEntity<Quotation, UpdateQuotation>(`${ENDPOINT}/${id}`, data);

export const submitQuotation = (id: string, price: number) =>
    updateEntity<Quotation, { quotedPrice: number }>(
        `${ENDPOINT}/${id}/submit`,
        { quotedPrice: price }
    );

export const deleteQuotation = (id: string) =>
    deleteEntity(`${ENDPOINT}/${id}`);