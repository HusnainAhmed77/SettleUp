'use client';

import { useState } from 'react';
import { X, DollarSign, Users, Calculator } from 'lucide-react';
import Button from './ui/Button';
import Input, { CurrencyInput } from './ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';
import Avatar from './ui/Avatar';
import { User } from '@/lib/mockData';
import { SplitType, parseToCents, formatCents } from '@/lib/split';
import { dataStore } from '@/lib/store';

interface AddExpenseFormProps {
  groupId: string;
  members: User[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseForm({ groupId, members, onClose, onSuccess }: AddExpenseFormProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(members[0]?.id || '');
  const [multiplePayers, setMultiplePayers] = useState(false);
  const [payerAmounts, setPayerAmounts] = useState<{ [userId: string]: string }>({});
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(members.map(m => m.id));
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [customSplits, setCustomSplits] = useState<{ [userId: string]: string }>({});

  const handleSubmit = () => {
    try {
      const amountCents = parseToCents(amount);
      
      let customSplitsData: { [userId: string]: number } | undefined;
      
      if (splitType === 'percentage') {
        customSplitsData = {};
        selectedParticipants.forEach(id => {
          customSplitsData![id] = parseFloat(customSplits[id] || '0');
        });
      } else if (splitType === 'exact') {
        customSplitsData = {};
        selectedParticipants.forEach(id => {
          customSplitsData![id] = parseToCents(customSplits[id] || '0');
        });
      }

      // Handle multiple payers
      let payersData: { userId: string; amountCents: number }[] | undefined;
      if (multiplePayers) {
        payersData = selectedParticipants.map(id => ({
          userId: id,
          amountCents: parseToCents(payerAmounts[id] || '0'),
        }));
      }

      dataStore.addExpense(
        groupId,
        title,
        amountCents,
        payerId,
        selectedParticipants,
        splitType,
        customSplitsData,
        payersData
      );

      onSuccess();
      onClose();
    } catch (error) {
      alert('Error adding expense: ' + (error as Error).message);
    }
  };

  const toggleParticipant = (userId: string) => {
    if (selectedParticipants.includes(userId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== userId));
    } else {
      setSelectedParticipants([...selectedParticipants, userId]);
    }
  };

  const calculateSplit = () => {
    const amountCents = parseToCents(amount);
    if (splitType === 'equal' && selectedParticipants.length > 0) {
      const perPerson = amountCents / selectedParticipants.length / 100;
      return perPerson.toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Expense</CardTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? 'bg-teal-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Expense Details
                </h3>
                
                <Input
                  label="Description"
                  placeholder="e.g., Groceries, Dinner, Rent"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-4"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <CurrencyInput
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={() => setStep(2)}
                  disabled={!title || !amount || parseFloat(amount) <= 0}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Who Paid */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Who paid?</h3>
                
                {/* Toggle for multiple payers */}
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={multiplePayers}
                    onChange={(e) => setMultiplePayers(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-medium text-blue-900">Multiple people paid different amounts</span>
                </label>

                {!multiplePayers ? (
                  // Single payer
                  <div className="space-y-2">
                    {members.map(member => (
                      <label
                        key={member.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                          payerId === member.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payer"
                          value={member.id}
                          checked={payerId === member.id}
                          onChange={() => setPayerId(member.id)}
                          className="w-4 h-4 text-teal-600"
                        />
                        <Avatar alt={member.name} initials={member.name} size="sm" />
                        <span className="font-medium">{member.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  // Multiple payers
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-3">Enter how much each person paid:</p>
                    {members.map(member => (
                      <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200">
                        <Avatar alt={member.name} initials={member.name} size="sm" />
                        <span className="flex-1 font-medium">{member.name}</span>
                        <span className="text-gray-600">$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={payerAmounts[member.id] || ''}
                          onChange={(e) => setPayerAmounts({ ...payerAmounts, [member.id]: e.target.value })}
                          className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                        />
                      </div>
                    ))}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total paid: ${
                        Object.values(payerAmounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)
                      }</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 3: Select Participants */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Split with whom?
                </h3>
                
                <div className="space-y-2">
                  {members.map(member => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedParticipants.includes(member.id)
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(member.id)}
                        onChange={() => toggleParticipant(member.id)}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <Avatar alt={member.name} initials={member.name} size="sm" />
                      <span className="font-medium">{member.name}</span>
                    </label>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  {selectedParticipants.length} {selectedParticipants.length === 1 ? 'person' : 'people'} selected
                </p>
              </div>

              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button
                  variant="primary"
                  onClick={() => setStep(4)}
                  disabled={selectedParticipants.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Split Type */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  How to split?
                </h3>

                {/* Split Type Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => setSplitType('equal')}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      splitType === 'equal'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">⚖️</div>
                    <div className="font-semibold">Equally</div>
                  </button>
                  <button
                    onClick={() => setSplitType('percentage')}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      splitType === 'percentage'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">%</div>
                    <div className="font-semibold">Percentage</div>
                  </button>
                  <button
                    onClick={() => setSplitType('exact')}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      splitType === 'exact'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💵</div>
                    <div className="font-semibold">Exact</div>
                  </button>
                </div>

                {/* Equal Split Preview */}
                {splitType === 'equal' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Each person pays:</p>
                    <p className="text-2xl font-bold text-teal-600">${calculateSplit()}</p>
                  </div>
                )}

                {/* Percentage Split Inputs */}
                {splitType === 'percentage' && (
                  <div className="space-y-3">
                    {selectedParticipants.map(id => {
                      const member = members.find(m => m.id === id);
                      return (
                        <div key={id} className="flex items-center gap-3">
                          <Avatar alt={member?.name} initials={member?.name} size="sm" />
                          <span className="flex-1 font-medium">{member?.name}</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={customSplits[id] || ''}
                            onChange={(e) => setCustomSplits({ ...customSplits, [id]: e.target.value })}
                            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                          />
                          <span className="text-gray-600">%</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Exact Amount Inputs */}
                {splitType === 'exact' && (
                  <div className="space-y-3">
                    {selectedParticipants.map(id => {
                      const member = members.find(m => m.id === id);
                      return (
                        <div key={id} className="flex items-center gap-3">
                          <Avatar alt={member?.name} initials={member?.name} size="sm" />
                          <span className="flex-1 font-medium">{member?.name}</span>
                          <span className="text-gray-600">$</span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={customSplits[id] || ''}
                            onChange={(e) => setCustomSplits({ ...customSplits, [id]: e.target.value })}
                            className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Add Expense
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
