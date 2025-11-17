'use client';

import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UpcomingExpenseCard from './UpcomingExpenseCard';
import AddUpcomingExpenseForm from './AddUpcomingExpenseForm';
import ConvertToExpenseDialog from './ConvertToExpenseDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useUpcomingExpenses, useGroups } from '@/hooks/useStore';
import { UpcomingExpense } from '@/lib/split';

export default function UpcomingExpensesSection() {
  const upcomingExpenses = useUpcomingExpenses();
  const groups = useGroups();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<UpcomingExpense | null>(null);

  // Sort by target date (earliest first)
  const sortedExpenses = [...upcomingExpenses].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  const handleEdit = (expense: UpcomingExpense) => {
    setSelectedExpense(expense);
    setShowAddForm(true);
  };

  const handleDelete = (expense: UpcomingExpense) => {
    setSelectedExpense(expense);
    setShowDeleteDialog(true);
  };

  const handleConvert = (expense: UpcomingExpense) => {
    setSelectedExpense(expense);
    setShowConvertDialog(true);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#333333]">
            Upcoming Expenses
          </h2>
          <p className="text-[#666666] mt-1">
            Plan and track future shared costs
          </p>
        </div>
        <Button 
          variant="primary"
          className="gap-2"
          onClick={() => {
            setSelectedExpense(null);
            setShowAddForm(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Add Upcoming Expense
        </Button>
      </div>
      
      {sortedExpenses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedExpenses.map(expense => {
            const group = groups.find(g => g.id === expense.groupId);
            if (!group) return null;
            
            return (
              <UpcomingExpenseCard
                key={expense.id}
                expense={expense}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onConvert={handleConvert}
              />
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12 border-2 border-dashed border-gray-300 bg-white">
          <CardContent>
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#333333]">
              No upcoming expenses
            </h3>
            <p className="text-[#666666] mb-6 max-w-md mx-auto">
              Plan future shared costs by adding upcoming expenses. 
              You can convert them to actual expenses when they occur.
            </p>
            <Button 
              variant="primary"
              onClick={() => {
                setSelectedExpense(null);
                setShowAddForm(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Upcoming Expense
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <AddUpcomingExpenseForm
          expense={selectedExpense}
          onClose={() => {
            setShowAddForm(false);
            setSelectedExpense(null);
          }}
          onSuccess={() => {
            // Data will auto-refresh via useUpcomingExpenses hook
          }}
        />
      )}

      {/* Convert to Expense Dialog */}
      {showConvertDialog && selectedExpense && (
        <ConvertToExpenseDialog
          expense={selectedExpense}
          group={groups.find(g => g.id === selectedExpense.groupId)!}
          onClose={() => {
            setShowConvertDialog(false);
            setSelectedExpense(null);
          }}
          onSuccess={() => {
            // Data will auto-refresh
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedExpense && (
        <DeleteConfirmationDialog
          expense={selectedExpense}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedExpense(null);
          }}
          onSuccess={() => {
            // Data will auto-refresh
          }}
        />
      )}
    </div>
  );
}
