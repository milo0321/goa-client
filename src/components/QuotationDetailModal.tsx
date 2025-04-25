import { useState, useEffect } from 'react';
import { useQuotationStore } from '../store/quotationStore';
import { formatDate } from '../utils/date';

interface QuotationDetailModalProps {
  quotationId: string;
  onClose: () => void;
  onSubmit?: (id: string, price: number) => Promise<void>;
}

export function QuotationDetailModal({
  quotationId,
  onClose,
  onSubmit
}: QuotationDetailModalProps) {
  const [price, setPrice] = useState('');
  const { currentItem, getItem } = useQuotationStore();

  useEffect(() => {
    getItem(quotationId);
  }, [quotationId, getItem]);

  const handleSubmit = async () => {
    if (!onSubmit || !price) return;
    await onSubmit(quotationId, parseFloat(price));
    onClose();
  };

  if (!currentItem || currentItem.id !== quotationId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {currentItem.status === 'pending' ? 'Submit Quotation' : 'Quotation Details'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <p className="mt-1">{currentItem.productName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <p className="mt-1">{currentItem.quantity}</p>
            </div>
          </div>

          {currentItem.status === 'quoted' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quoted Price</label>
                <p className="mt-1">${currentItem.quotedPrice}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quoted Date</label>
                <p className="mt-1">{formatDate(currentItem.quotedDate)}</p>
              </div>
            </div>
          )}

          {currentItem.status === 'pending' && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Unit Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                step="0.01"
                min="0"
              />
            </div>
          )}

          {currentItem.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <p className="mt-1 whitespace-pre-line">{currentItem.notes}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          {currentItem.status === 'pending' && (
            <button
              onClick={handleSubmit}
              disabled={!price}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              Submit Quotation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}