'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserWeightUnitPreference, updateUserWeightUnitPreference } from '@/actions/user';

type WeightUnit = 'kg' | 'lbs';

interface WeightUnitContextType {
  preferredUnit: WeightUnit;
  setPreferredUnit: (unit: WeightUnit) => Promise<void>;
  isLoading: boolean;
}

const WeightUnitContext = createContext<WeightUnitContextType | undefined>(undefined);

export function useWeightUnit() {
  const context = useContext(WeightUnitContext);
  if (context === undefined) {
    throw new Error('useWeightUnit must be used within a WeightUnitProvider');
  }
  return context;
}

interface WeightUnitProviderProps {
  children: ReactNode;
}

export function WeightUnitProvider({ children }: WeightUnitProviderProps) {
  const [preferredUnit, setPreferredUnit] = useState<WeightUnit>('kg');
  const [isLoading, setIsLoading] = useState(true);

  // Load user preference on initial render
  useEffect(() => {
    async function loadPreference() {
      try {
        const unit = await getUserWeightUnitPreference();
        setPreferredUnit(unit);
      } catch (error) {
        console.error('Failed to load weight unit preference:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreference();
  }, []);

  // Update preference in the database and state
  async function handleSetPreferredUnit(unit: WeightUnit) {
    try {
      await updateUserWeightUnitPreference(unit);
      setPreferredUnit(unit);
    } catch (error) {
      console.error('Failed to update weight unit preference:', error);
      throw error;
    }
  }

  const value = {
    preferredUnit,
    setPreferredUnit: handleSetPreferredUnit,
    isLoading,
  };

  return (
    <WeightUnitContext.Provider value={value}>
      {children}
    </WeightUnitContext.Provider>
  );
} 