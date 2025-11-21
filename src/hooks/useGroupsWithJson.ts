// Hook that loads groups and ensures they're synced with JSON system

import { useState, useEffect } from 'react';
import { useGroups } from './useStore';
import { groupDataService } from '@/services/groupDataService';
import { Group } from '@/lib/mockData';

/**
 * Hook that loads groups and syncs with JSON system
 * This ensures dashboard shows accurate data from JSON documents
 */
export function useGroupsWithJson() {
  const oldGroups = useGroups();
  const [syncedGroups, setSyncedGroups] = useState<Group[]>(oldGroups);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncGroupsWithJson = async () => {
      if (oldGroups.length === 0) {
        setSyncedGroups([]);
        return;
      }

      setLoading(true);
      
      try {
        // For each group, check if JSON data exists and use it
        const synced = await Promise.all(
          oldGroups.map(async (group) => {
            try {
              // Try to load from JSON system
              const jsonData = await groupDataService.loadGroupData(group.id);
              
              if (jsonData) {
                console.log(`✅ Using JSON data for group ${group.name}:`, {
                  expensesCount: jsonData.expenses.length,
                  settlementsCount: jsonData.settlements.length,
                  totalExpenseAmount: jsonData.expenses.reduce((sum, e) => sum + e.amountCents, 0),
                });
                
                // Use JSON data (has accurate expenses and pre-computed balances)
                return {
                  ...group,
                  expenses: jsonData.expenses.map(e => ({
                    ...e,
                    date: new Date(e.date),
                  })),
                  settlements: jsonData.settlements.map(s => ({
                    ...s,
                    date: new Date(s.date),
                  })),
                };
              }
            } catch (error) {
              console.warn(`No JSON data for group ${group.id}, using old data`);
            }
            
            // Fall back to old group data
            return group;
          })
        );
        
        setSyncedGroups(synced);
      } catch (error) {
        console.error('Error syncing groups with JSON:', error);
        setSyncedGroups(oldGroups);
      } finally {
        setLoading(false);
      }
    };

    syncGroupsWithJson();
  }, [oldGroups]);

  return { groups: syncedGroups, loading };
}
