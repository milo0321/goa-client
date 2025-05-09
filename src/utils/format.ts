import { PackingDetail, ProductionTime } from '../features/quotation/types/quotation.types';

export const formatPackingMethodDescription = (method: PackingDetail): string => {
  const inner = method.innerPack?.value ? `${method.innerPack.value}${method.innerPack.unit || ''}` : '';
  const outer = method.outerPack?.value ? `${method.outerPack.value}${method.outerPack.unit || ''}` : '';

  const size = method.cartonSize?.length && method.cartonSize?.width && method.cartonSize?.height
    ? `carton size: ${method.cartonSize.length}×${method.cartonSize.width}×${method.cartonSize.height}${method.cartonSize.unit || ''}`
    : '';

  const weight = method.weight?.value ? `GW: ${method.weight.value}${method.weight.unit || ''}` : '';

  return [inner, outer, size, weight].filter(Boolean).join(', ');
};

export const formatProductionTime = (value: ProductionTime): string => {
  const { type, from, to, unit } = value;

  if (type === 'exact') {
    return `${from} ${unit}`;
  }

  if (type === 'range') {
    return `${from}–${to} ${unit}`;
  }

  return '';
};