import { useEffect, useState } from 'react';
import { dataStore } from '@/lib/store';
import { Group } from '@/lib/mockData';
import { UpcomingExpense } from '@/lib/split';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(dataStore.getGroups());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setGroups(dataStore.getGroups());
    });
    return unsubscribe;
  }, []);

  return groups;
}

export function useGroup(id: string) {
  const [group, setGroup] = useState<Group | undefined>(dataStore.getGroup(id));

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setGroup(dataStore.getGroup(id));
    });
    return unsubscribe;
  }, [id]);

  return group;
}

export function useUpcomingExpenses() {
  const [upcomingExpenses, setUpcomingExpenses] = useState<UpcomingExpense[]>(
    dataStore.getUpcomingExpenses()
  );

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setUpcomingExpenses(dataStore.getUpcomingExpenses());
    });
    return unsubscribe;
  }, []);

  return upcomingExpenses;
}

export function useUpcomingExpensesByGroup(groupId: string) {
  const [upcomingExpenses, setUpcomingExpenses] = useState<UpcomingExpense[]>(
    dataStore.getUpcomingExpenses().filter(exp => exp.groupId === groupId)
  );

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setUpcomingExpenses(
        dataStore.getUpcomingExpenses().filter(exp => exp.groupId === groupId)
      );
    });
    return unsubscribe;
  }, [groupId]);

  return upcomingExpenses;
}

export function useUpcomingExpensesActions() {
  return {
    addUpcomingExpense: dataStore.addUpcomingExpense.bind(dataStore),
    updateUpcomingExpense: dataStore.updateUpcomingExpense.bind(dataStore),
    deleteUpcomingExpense: dataStore.deleteUpcomingExpense.bind(dataStore),
    convertToExpense: dataStore.convertToExpense.bind(dataStore),
  };
}
