'use client';

import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import Button from './ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatCents, parseToCents } from '@/lib/split';
import { useCurrency } from '@/hooks/useCurrency';
import { useCurrencySymbol } from '@/hooks/useCurrencySymbol';

interface SettleUpModalProps {
  fromName: string;
  toName: string;
  totalAmountCents: number;
  onConfirm: (amountCents: number) => void;
  onClose: () => void;
}

export default function SettleUpModal({ 
  fromName, 
  toName, 
  totalAmountCents, 
  onConfirm, 
  onClose 
}: SettleUpModalProps) {
  const userCurrency = useCurrency();
  const currencySymbol = useCurrencySymbol();
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');
    
    if (paymentType === 'full') {
      onConfirm(totalAmountCents);
      onClose();
    } else {
      const amountCents = parseToCents(partialAmount);
      
      if (amountCents <= 0) {
        setError(`Amount must be greater than ${currencySymbol}0`);
        return;
      }
      
      if (amountCents > totalAmountCents) {
        setError('Amount cannot exceed total owed');
        return;
      }
      
      onConfirm(amountCents);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Settle Up</CardTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-gradient-to-br from-[#FF007F]/10 to-[#00CFFF]/10 p-4 rounded-lg">
              <p className="text-sm text-[#666666] mb-2">Payment from</p>
              <p className="font-bold text-[#333333] text-lg mb-3">{fromName} → {toName}</p>
              <p className="text-sm text-[#666666]">Total owed:</p>
              <p className="text-3xl font-bold text-[#FF007F]">{formatCents(totalAmountCents, userCurrency)}</p>
            </div>

            {/* Payment Type Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition hover:border-[#FF007F]">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === 'full'}
                  onChange={() => setPaymentType('full')}
                  className="w-4 h-4 text-[#FF007F]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#333333]">Pay Full Amount</p>
                  <p className="text-sm text-[#666666]">Settle the entire balance</p>
                </div>
                <p className="font-bold text-[#FF007F]">{formatCents(totalAmountCents, userCurrency)}</p>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition hover:border-[#FF007F]">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === 'partial'}
                  onChange={() => setPaymentType('partial')}
                  className="w-4 h-4 text-[#FF007F]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#333333]">Pay Partial Amount</p>
                  <p className="text-sm text-[#666666]">Pay part of the balance now</p>
                </div>
              </label>
            </div>

            {/* Partial Amount Input */}
            {paymentType === 'partial' && (
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]">{currencySymbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={partialAmount}
                    onChange={(e) => {
                      setPartialAmount(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20 outline-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 mt-2">⚠️ {error}</p>
                )}
                <p className="text-sm text-[#666666] mt-2">
                  Remaining after payment: {formatCents(totalAmountCents - parseToCents(partialAmount || '0'), userCurrency)}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirm}
                className="flex-1 bg-[#FF007F] hover:bg-[#00CFFF] text-white"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
