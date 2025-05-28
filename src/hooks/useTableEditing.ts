import { useState, useCallback, useEffect } from 'react';
import type { DashboardData, LineData } from '../types';

interface UseTableEditingProps {
  initialData: DashboardData | null;
  onUpdateData: (data: DashboardData) => void;
}

export const useTableEditing = ({ initialData, onUpdateData }: UseTableEditingProps) => {
  const [data, setData] = useState<DashboardData | null>(initialData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<DashboardData | null>(initialData);

  // Update internal state when initialData changes
  useEffect(() => {
    setData(initialData);
    setLastSavedData(initialData);
  }, [initialData]);

  const handleCellUpdate = useCallback((
    lineId: number, 
    field: keyof LineData, 
    newValue: number
  ) => {
    if (!data) return;

    const updatedData: DashboardData = {
      ...data,
      lines: data.lines.map((line) => {
        if (line.id === lineId) {
          const updatedLine = { ...line, [field]: newValue };
          
          // Update productionPerHour if hourlyTarget changes
          if (field === 'hourlyTarget' && updatedLine.hourlyTarget > 0) {
            updatedLine.productionPerHour = Math.round(
              updatedLine.actualProduction / updatedLine.hourlyTarget
            );
          }
          
          return updatedLine;
        }
        return line;
      })
    };

    setData(updatedData);
    setHasUnsavedChanges(true);
    onUpdateData(updatedData);
  }, [data, onUpdateData]);

  const saveChanges = useCallback(() => {
    if (data) {
      setLastSavedData(data);
      setHasUnsavedChanges(false);
    }
  }, [data]);

  const discardChanges = useCallback(() => {
    if (lastSavedData) {
      setData(lastSavedData);
      setHasUnsavedChanges(false);
      onUpdateData(lastSavedData);
    }
  }, [lastSavedData, onUpdateData]);

  return {
    data,
    hasUnsavedChanges,
    handleCellUpdate,
    saveChanges,
    discardChanges
  };
}; 