'use client';

import { X, AlertTriangle } from 'lucide-react';
import { UpcomingExpense } from '@/lib/split';
import { useUpcomingExpensesActions } from '@/hooks/useStore';
import Button from '@/components/ui/Button';

interface DeleteConfirmationDialogProps {
  expense: UpcomingExpense;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmationDialog({
  expense,
  onClose,
  onSuccess,
}: DeleteConfirmationDialogProps) {
  const { deleteUpcomingExpense } = useUpcomingExpensesActions();

  const handleDelete = () => {
    deleteUpcomingExpense(expense.id);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#333333]">Delete Upcoming Expense</h2>
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
            Are you sure you want to delete <span className="font-semibold text-[#333333]">"{expense.title}"</span>? 
            This action cannot be undone.
          </p>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This will only remove the upcoming expense. 
              It will not affect any actual expenses in the group.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
