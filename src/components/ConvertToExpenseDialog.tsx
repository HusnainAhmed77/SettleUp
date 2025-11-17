'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { UpcomingExpense } from '@/lib/split';
import { Group } from '@/lib/mockData';
import { useUpcomingExpensesActions } from '@/hooks/useStore';
import { formatCents } from '@/lib/split';
import Button from '@/components/ui/Button';

interface ConvertToExpenseDialogProps {
  expense: UpcomingExpense;
  group: Group;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ConvertToExpenseDialog({
  expense,
  group,
  onClose,
  onSuccess,
}: ConvertToExpenseDialogProps) {
  const { convertToExpense } = useUpcomingExpensesActions();
  const [payerId, setPayerId] = useState(expense.participants[0] || '');
  const [actualDate, setActualDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [removeAfter, setRemoveAfter] = useState(true);

  const handleSubmit = () => {
    convertToExpense(
      expense.id,
      payerId,
      new Date(actualDate),
      removeAfter
    );
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#333333]">Record Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-[#666666]">
            Convert this upcoming expense to an actual expense in the group.
          </p>

          {/* Pre-filled expense details */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-[#666666]">Title:</span>
              <span className="font-medium text-[#333333]">{expense.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#666666]">Amount:</span>
              <span className="font-medium text-[#333333]">
                {formatCents(expense.amountCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#666666]">Group:</span>
              <span className="font-medium text-[#333333]">{group.name}</span>
            </div>
          </div>

          {/* Who paid? */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">
              Who paid for this expense? *
            </label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#3cc9bb] transition-all"
            >
              {expense.participants.map(userId => {
                const user = group.members.find(m => m.id === userId);
                return (
                  <option key={userId} value={userId}>
                    {user?.name || 'Unknown'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Actual date */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">
              Date of expense
            </label>
            <input
              type="date"
              value={actualDate}
              onChange={(e) => setActualDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#3cc9bb] transition-all"
            />
          </div>

          {/* Remove upcoming expense option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeAfter}
              onChange={(e) => setRemoveAfter(e.target.checked)}
              className="w-5 h-5 text-[#3cc9bb] rounded focus:ring-[#3cc9bb]"
            />
            <span className="text-sm text-[#333333]">
              Remove from upcoming expenses after recording
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            className="bg-[#3cc9bb] hover:bg-[#35b3a7]"
          >
            Record Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
