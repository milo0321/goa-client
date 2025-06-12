import dayjs from 'dayjs';
import { Field } from '@/types/ui';

/**
 * 自动根据字段类型转换 initialData 中的值
 * - 将 `date` 字段自动转为 dayjs 实例
 */
export function transformFormDataByFieldTypes(
  fields: Field[],
  initialData: unknown,
): Record<string, unknown> {
  if (typeof initialData !== 'object' || initialData === null) {
    return {};
  }

  const rawData = initialData as Record<string, unknown>;
  const patchedData: Record<string, unknown> = { ...rawData };

  fields.forEach(field => {
    if (field.type === 'date' && initialData[field.name]) {
      patchedData[field.name] = dayjs(initialData[field.name]);
    }
  });

  return patchedData;
}

// export function formatDate(date: Date | string | undefined): string {
//   if (!date) return '';
//   const d = new Date(date);
//   return d.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });
// }

