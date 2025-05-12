import { PackingDetail, ProductionTime, QuotePrice, AdditionalFee } from '../features/quotation/types/quotation.types';


export function formatQuotePrice(q: QuotePrice): string {
  const { method, terms, destination, prices } = q;

  // 默认货币为 USD
  const formattedPrices = prices
    .map(p => {
      const currency = p.currency ?? 'USD';
      const unit = currency.toLowerCase() + '/p';
      return `${p.unitPrice}${unit} for ${p.quantity}pcs`;
    })
    .join(', ');

  const termsText = terms ? `${terms} ` : '';
  const destinationText = destination ? `${destination} ` : '';

  return `Unit price ${termsText}${destinationText}by ${method}: ${formattedPrices}`;
}

export function formatQuotePrices(quotes: QuotePrice[]): string {
  if (!quotes || quotes.length === 0) {
    return '';
  }
  return quotes.map(formatQuotePrice).join('\n');
}

export function formatAdditionalFee(fees: AdditionalFee[]): string {
  if (!fees || fees.length === 0) {
    return '';
  }
  return fees
    .map(fee => {
      const refundableText = fee.refundable ? 'refundable' : 'non-refundable';
      const conditionsText = fee.conditions ? `(${fee.conditions})` : '';
      return `${fee.feeType}: ${fee.amount}${refundableText} ${conditionsText}`;
    })
    .join(', ');
}

export const formatPackingDetail = (method: PackingDetail): string => {
  const inner = method.bagPack?.value ? `${method.bagPack.value}${method.bagPack.unit || ''}` : '';
  const outer = method.cartonPack?.value ? `${method.cartonPack.value}${method.cartonPack.unit || ''}` : '';

  const size = method.cartonSize?.length && method.cartonSize?.width && method.cartonSize?.height
    ? `carton size: ${method.cartonSize.length}×${method.cartonSize.width}×${method.cartonSize.height}${method.cartonSize.unit || ''}`
    : '';

  const weightStr = method.weight?.value ? `GW: ${method.weight.value}${method.weight.unit || ''}` : '';

  // 判断是否为抛货（Volumetric Weight）
  let volumetricWeightKg = 0;
  let isVolumetric = '';

  if (method.cartonSize?.length && method.cartonSize?.width && method.cartonSize?.height) {
    const volumeCm = method.cartonSize.length * method.cartonSize.width * method.cartonSize.height;
    volumetricWeightKg = volumeCm / 5500;

    if (method.weight?.value) {
      if (volumetricWeightKg > method.weight.value) {
        isVolumetric = '**Volumetric Weight ↑**';
      } else {
        isVolumetric = 'Standard Weight';
      }
    }
  }

  return [inner, outer, size, weightStr, isVolumetric].filter(Boolean).join(', ');
};

export const formatPackingDetails = (methods: PackingDetail[]): string => {
  if (!methods || methods.length === 0) {
    return '';
  }
  return methods.map(method => formatPackingDetail(method)).join(' | ');
};

export const formatProductionTime = (value: ProductionTime): string => {
  if (!value) {
    return '';
  }

  const { timeType, fromTime, toTime, unit } = value;

  if (timeType === 'exact') {
    return `${fromTime} ${unit}`;
  }

  if (timeType === 'range') {
    return `${fromTime}–${toTime} ${unit}`;
  }

  return '';
};