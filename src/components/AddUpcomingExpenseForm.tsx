'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { UpcomingExpense, SplitType } from '@/lib/split';
import { useGroups, useUpcomingExpensesActions } from '@/hooks/useStore';
import { currentUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface AddUpcomingExpenseFormProps {
  expense?: UpcomingExpense | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  amount: string;
  targetDate: string;
  groupId: string;
  notes: string;
  participants: string[];
  splitType: SplitType;
  splits: { [userId: string]: number };
}

export default function AddUpcomingExpenseForm({
  expense,
  onClose,
  onSuccess,
}: AddUpcomingExpenseFormProps) {
  const groups = useGroups();
  const { addUpcomingExpense, updateUpcomingExpense } = useUpcomingExpensesActions();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<FormData>({
    title: expense?.title || '',
    amount: expense ? (expense.amountCents / 100).toString() : '',
    targetDate: expense 
      ? new Date(expense.targetDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    groupId: expense?.groupId || '',
    notes: expense?.notes || '',
    participants: expense?.participants || [],
    splitType: expense?.splitType || 'equal',
    splits: expense?.splits || {},
  });

  const selectedGroup = groups.find(g => g.id === formData.groupId);

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
      if (!formData.targetDate) newErrors.targetDate = 'Date is required';
      if (!formData.groupId) newErrors.groupId = 'Group is required';
    }

    if (step === 2) {
      if (formData.participants.length < 2) {
        newErrors.participants = 'At least 2 participants required';
      }
    }

    if (step === 3) {
      if (formData.splitType === 'percentage') {
        const total = Object.values(formData.splits).reduce((sum, val) => sum + val, 0);
        if (Math.abs(total - 100) > 0.01) {
          newErrors.splits = 'Percentages must sum to 100%';
        }
      } else if (formData.splitType === 'exact') {
        const total = Object.values(formData.splits).reduce((sum, val) => sum + val, 0);
        const expectedTotal = Math.round(parseFloat(formData.amount) * 100);
        if (Math.abs(total - expectedTotal) > 1) {
          newErrors.splits = `Amounts must sum to ${formData.amount}`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateStep(3)) return;

    const amountCents = Math.round(parseFloat(formData.amount) * 100);

    if (expense) {
      // Update existing
      updateUpcomingExpense(expense.id, {
        title: formData.title,
        amountCents,
        targetDate: new Date(formData.targetDate),
        groupId: formData.groupId,
        participants: formData.participants,
        splitType: formData.splitType,
        splits: formData.splits,
        notes: formData.notes || undefined,
      });
    } else {
      // Create new
      addUpcomingExpense(
        formData.title,
        amountCents,
        new Date(formData.targetDate),
        formData.groupId,
        currentUser.id,
        formData.participants,
        formData.splitType,
        formData.splits,
        formData.notes || undefined
      );
    }

    onSuccess();
    onClose();
  };

  // Auto-calculate splits when participants or split type changes
  useEffect(() => {
    if (formData.participants.length === 0) return;

    if (formData.splitType === 'equal') {
      const amountCents = Math.round(parseFloat(formData.amount || '0') * 100);
      const perPerson = Math.floor(amountCents / formData.participants.length);
      const remainder = amountCents % formData.participants.length;
      
      const newSplits: { [userId: string]: number } = {};
      formData.participants.forEach((userId, index) => {
        newSplits[userId] = perPerson + (index < remainder ? 1 : 0);
      });
      setFormData(prev => ({ ...prev, splits: newSplits }));
    } else if (formData.splitType === 'percentage' && Object.keys(formData.splits).length === 0) {
      const perPerson = 100 / formData.participants.length;
      const newSplits: { [userId: string]: number } = {};
      formData.participants.forEach(userId => {
        newSplits[userId] = perPerson;
      });
      setFormData(prev => ({ ...prev, splits: newSplits }));
    } else if (formData.splitType === 'exact' && Object.keys(formData.splits).length === 0) {
      const amountCents = Math.round(parseFloat(formData.amount || '0') * 100);
      const perPerson = Math.floor(amountCents / formData.participants.length);
      const newSplits: { [userId: string]: number } = {};
      formData.participants.forEach(userId => {
        newSplits[userId] = perPerson;
      });
      setFormData(prev => ({ ...prev, splits: newSplits }));
    }
  }, [formData.splitType, formData.participants.length]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#333333]">
            {expense ? 'Edit' : 'Add'} Upcoming Expense
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 p-6 border-b bg-gray-50">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                currentStep === step
                  ? 'bg-[#3cc9bb] text-white scale-110'
                  : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {currentStep > step ? <Check className="w-5 h-5" /> : step}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <Step1BasicDetails
              formData={formData}
              setFormData={setFormData}
              groups={groups}
              errors={errors}
            />
          )}
          {currentStep === 2 && selectedGroup && (
            <Step2Participants
              formData={formData}
              setFormData={setFormData}
              group={selectedGroup}
              errors={errors}
            />
          )}
          {currentStep === 3 && selectedGroup && (
            <Step3SplitConfig
              formData={formData}
              setFormData={setFormData}
              group={selectedGroup}
              errors={errors}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Step {currentStep} of 3
          </div>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
                className="bg-[#3cc9bb] hover:bg-[#35b3a7]"
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                className="bg-[#3cc9bb] hover:bg-[#35b3a7]"
              >
                {expense ? 'Save Changes' : 'Create Upcoming Expense'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// Step 1: Basic Details
function Step1BasicDetails({ formData, setFormData, groups, errors }: any) {
  const today = new Date().toISOString().split('T')[0];
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const maxDate = oneYearFromNow.toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Expense Title *
        </label>
        <input
          type="text"
          placeholder="e.g., Monthly rent, Vacation hotel"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2 transition-all',
            errors.title
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-[#3cc9bb]'
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Amount *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={cn(
              'w-full pl-8 pr-4 py-3 rounded-lg border-2 transition-all font-mono',
              errors.amount
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-[#3cc9bb]'
            )}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Target Date */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Target Date *
        </label>
        <input
          type="date"
          min={today}
          max={maxDate}
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2 transition-all',
            errors.targetDate
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-[#3cc9bb]'
          )}
        />
        {errors.targetDate && (
          <p className="text-sm text-red-600 mt-1">{errors.targetDate}</p>
        )}
      </div>

      {/* Group Selection */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Group *
        </label>
        <select
          value={formData.groupId}
          onChange={(e) => setFormData({ 
            ...formData, 
            groupId: e.target.value,
            participants: [], // Reset participants when group changes
            splits: {}
          })}
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2 transition-all',
            errors.groupId
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-[#3cc9bb]'
          )}
        >
          <option value="">Select a group</option>
          {groups.map((group: any) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        {errors.groupId && (
          <p className="text-sm text-red-600 mt-1">{errors.groupId}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-2">
          Notes (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="Add any additional details..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#3cc9bb] transition-all resize-none"
        />
      </div>
    </div>
  );
}


// Step 2: Participants Selection
function Step2Participants({ formData, setFormData, group, errors }: any) {
  const toggleParticipant = (userId: string) => {
    const newParticipants = formData.participants.includes(userId)
      ? formData.participants.filter((id: string) => id !== userId)
      : [...formData.participants, userId];
    
    setFormData({ ...formData, participants: newParticipants });
  };

  const handleSelectAll = () => {
    setFormData({ 
      ...formData, 
      participants: group.members.map((m: any) => m.id) 
    });
  };

  const handleDeselectAll = () => {
    setFormData({ ...formData, participants: [] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#666666]">
          Select who will share this expense
        </p>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSelectAll}
            type="button"
          >
            Select All
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDeselectAll}
            type="button"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {group.members.map((member: any) => (
          <label
            key={member.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer',
              'transition-all duration-200',
              formData.participants.includes(member.id)
                ? 'border-[#3cc9bb] bg-[#3cc9bb]/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <input
              type="checkbox"
              checked={formData.participants.includes(member.id)}
              onChange={() => toggleParticipant(member.id)}
              className="w-5 h-5 text-[#3cc9bb] rounded focus:ring-[#3cc9bb]"
            />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3cc9bb] to-[#35b3a7] flex items-center justify-center text-white font-semibold text-sm">
              {member.name.charAt(0)}
            </div>
            <span className="font-medium text-[#333333]">{member.name}</span>
          </label>
        ))}
      </div>

      {errors.participants && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errors.participants}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          {formData.participants.length} participant(s) selected
        </p>
      </div>
    </div>
  );
}


// Step 3: Split Configuration
function Step3SplitConfig({ formData, setFormData, group, errors }: any) {
  const getUserName = (userId: string) => {
    return group.members.find((m: any) => m.id === userId)?.name || 'Unknown';
  };

  const handlePercentageChange = (userId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData({
      ...formData,
      splits: { ...formData.splits, [userId]: numValue }
    });
  };

  const handleExactChange = (userId: string, value: string) => {
    const numValue = Math.round(parseFloat(value) * 100) || 0;
    setFormData({
      ...formData,
      splits: { ...formData.splits, [userId]: numValue }
    });
  };

  const formatCents = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Split Type Selector */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-3">
          How should this be split?
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, splitType: 'equal' })}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              formData.splitType === 'equal'
                ? 'border-[#3cc9bb] bg-[#3cc9bb]/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="text-2xl mb-2">=</div>
            <div className="font-medium text-[#333333]">Equally</div>
            <div className="text-xs text-[#666666]">Split evenly</div>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, splitType: 'percentage' })}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              formData.splitType === 'percentage'
                ? 'border-[#3cc9bb] bg-[#3cc9bb]/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="text-2xl mb-2">%</div>
            <div className="font-medium text-[#333333]">Percentage</div>
            <div className="text-xs text-[#666666]">By percentage</div>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, splitType: 'exact' })}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              formData.splitType === 'exact'
                ? 'border-[#3cc9bb] bg-[#3cc9bb]/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="text-2xl mb-2">$</div>
            <div className="font-medium text-[#333333]">Exact</div>
            <div className="text-xs text-[#666666]">Exact amounts</div>
          </button>
        </div>
      </div>

      {/* Split Details */}
      <div>
        <label className="block text-sm font-medium text-[#333333] mb-3">
          Split breakdown
        </label>

        {formData.splitType === 'equal' && (
          <div className="space-y-2">
            {formData.participants.map((userId: string) => {
              const amount = formData.splits[userId] || 0;
              return (
                <div key={userId} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3cc9bb] to-[#35b3a7] flex items-center justify-center text-white text-xs font-semibold">
                      {getUserName(userId).charAt(0)}
                    </div>
                    <span className="font-medium text-[#333333]">{getUserName(userId)}</span>
                  </div>
                  <span className="font-semibold text-[#333333]">{formatCents(amount)}</span>
                </div>
              );
            })}
          </div>
        )}

        {formData.splitType === 'percentage' && (
          <div className="space-y-2">
            {formData.participants.map((userId: string) => {
              const percentage = (formData.splits[userId] as number) || 0;
              const amountCents = Math.round(parseFloat(formData.amount || '0') * 100 * percentage / 100);
              return (
                <div key={userId} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3cc9bb] to-[#35b3a7] flex items-center justify-center text-white text-xs font-semibold">
                    {getUserName(userId).charAt(0)}
                  </div>
                  <span className="flex-1 font-medium text-[#333333]">{getUserName(userId)}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-20 px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-[#3cc9bb] text-right"
                    value={percentage}
                    onChange={(e) => handlePercentageChange(userId, e.target.value)}
                  />
                  <span className="w-8 text-[#666666]">%</span>
                  <span className="w-24 text-right font-semibold text-[#333333]">
                    {formatCents(amountCents)}
                  </span>
                </div>
              );
            })}
            <div className={cn(
              'mt-2 p-2 rounded text-sm',
              errors.splits ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
            )}>
              Total: {(Object.values(formData.splits) as number[]).reduce((a, b) => a + b, 0).toFixed(2)}%
              {errors.splits && <span className="ml-2">({errors.splits})</span>}
            </div>
          </div>
        )}

        {formData.splitType === 'exact' && (
          <div className="space-y-2">
            {formData.participants.map((userId: string) => {
              const amountCents = (formData.splits[userId] as number) || 0;
              return (
                <div key={userId} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3cc9bb] to-[#35b3a7] flex items-center justify-center text-white text-xs font-semibold">
                    {getUserName(userId).charAt(0)}
                  </div>
                  <span className="flex-1 font-medium text-[#333333]">{getUserName(userId)}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-32 pl-7 pr-3 py-2 rounded-lg border-2 border-gray-300 focus:border-[#3cc9bb] text-right font-mono"
                      value={(amountCents / 100).toFixed(2)}
                      onChange={(e) => handleExactChange(userId, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
            <div className={cn(
              'mt-2 p-2 rounded text-sm',
              errors.splits ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
            )}>
              Total: {formatCents((Object.values(formData.splits) as number[]).reduce((a, b) => a + b, 0))}
              {errors.splits && <span className="ml-2">({errors.splits})</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
