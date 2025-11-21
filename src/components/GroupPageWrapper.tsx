// Wrapper component that loads group data from JSON system with fallback to old system

'use client';

import { useEffect, useState } from 'react';
import { useGroup } from '@/hooks/useStore';
import { useGroupData } from '@/hooks/useGroupData';
import { Group } from '@/lib/mockData';
import { GroupData } from '@/types/groupData';
import { migrateGroupToJSON, isGroupMigrated } from '@/services/groupMigrationHelper';
import { groupComputationService } from '@/services/groupComputationService';

interface GroupPageWrapperProps {
  groupId: string;
  children: (data: {
    group: Group | null;
    groupData: GroupData | null;
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    useJsonSystem: boolean;
  }) => React.ReactNode;
}

/**
 * Wrapper that handles loading group data from JSON system with fallback
 */
export default function GroupPageWrapper({ groupId, children }: GroupPageWrapperProps) {
  const [useJsonSystem, setUseJsonSystem] = useState<boolean>(false);
  const [checkingMigration, setCheckingMigration] = useState<boolean>(true);
  
  // Load from old system (fallback)
  const oldGroup = useGroup(groupId);
  
  // Load from new JSON system
  const { groupData, loading: jsonLoading, error: jsonError, refresh } = useGroupData(useJsonSystem ? groupId : null);

  // Check if group has been migrated
  useEffect(() => {
    const checkMigration = async () => {
      try {
        const migrated = await isGroupMigrated(groupId);
        setUseJsonSystem(migrated);
        
        // If not migrated and we have old group data, migrate it
        if (!migrated && oldGroup) {
          console.log('🔄 Group not migrated, attempting migration...');
          try {
            await migrateGroupToJSON(oldGroup);
            setUseJsonSystem(true);
            refresh();
          } catch (error) {
            console.error('Migration failed, falling back to old system:', error);
            setUseJsonSystem(false);
          }
        }
      } catch (error) {
        console.error('Error checking migration status:', error);
        setUseJsonSystem(false);
      } finally {
        setCheckingMigration(false);
      }
    };

    checkMigration();
  }, [groupId, oldGroup]);
  


  // Convert GroupData to Group format for backward compatibility
  const convertedGroup: Group | null = groupData ? {
    id: groupData.group.id,
    name: groupData.group.name,
    description: groupData.group.description,
    userId: groupData.group.userId,
    members: groupData.members,
    expenses: groupData.expenses.map(e => ({
      ...e,
      date: new Date(e.date),
    })),
    settlements: groupData.settlements.map(s => ({
      ...s,
      date: new Date(s.date),
    })),
    createdAt: new Date(groupData.group.createdAt),
    currency: groupData.group.currency,
  } : null;

  const loading = checkingMigration || (useJsonSystem && jsonLoading);
  const error = useJsonSystem ? jsonError : null;
  const group = useJsonSystem ? convertedGroup : (oldGroup || null);

  return (
    <>
      {children({
        group,
        groupData,
        loading,
        error,
        refresh,
        useJsonSystem,
      })}
    </>
  );
}
