// Hook for loading group data from JSON-based system

import { useState, useEffect } from 'react';
import { GroupData } from '@/types/groupData';
import { groupDataService } from '@/services/groupDataService';

/**
 * Hook to load and manage group data from expenses_data collection
 * @param groupId - The group ID to load
 * @returns Object with groupData, loading state, error, and refresh function
 */
export function useGroupData(groupId: string | null) {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await groupDataService.loadGroupData(groupId);
      
      if (data) {
        setGroupData(data);
      } else {
        setError(new Error('Group data not found'));
      }
    } catch (err) {
      console.error('Error loading group data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [groupId]);

  return {
    groupData,
    loading,
    error,
    refresh: loadData,
  };
}
