import { ReactNode } from 'react';

declare module '@/types/home' {
  type Tool = {
    id: string;
    name: string;
    icon: ReactNode;
    component: ReactNode;
    shortcut?: string; // 如"Ctrl+Shift+F"
  };

  type FreightUnit = 'cm' | 'inch' | 'meter';
  type WeightUnit = 'kg' | 'lb';

  interface FreightDimensions {
    length: string;
    width: string;
    height: string;
    weight: string;
    unit?: FreightUnit;
  }
}