import { useEffect, useState } from 'react';
import { useQuotationStore } from '../store/quotationStore';
import { useCustomerStore } from '../store/customerStore';
import { GenericTable } from '../components/GenericTable';
import Pagination from '../components/Pagination';
import { IconRefresh, IconPlus } from '@tabler/icons-react';
import {CreateQuotationModal} from '../components/CreateQuotationModal';
import {QuotationDetailModal} from '../components/QuotationDetailModal';
import { formatDate } from '../utils/date';

export default function QuotationList() {
    return <div>Customer QuotationList Page</div>;
}