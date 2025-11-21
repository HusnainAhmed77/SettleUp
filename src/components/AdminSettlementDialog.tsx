'use client';

import { useState } from 'react';
import { X, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';
import { recordAdminSettlement } from '@/services/adminService';
import ProfilePictureDisplay from './ProfilePictureDisplay';

interface User {
  userId: string;
  name: string;
  profilePicture?: string;
}

interface AdminSettlementDialogProps {
  isOpen: boolean;
  groupId: string;
  adminUserId: string;
  fromUser: User;
  toUser: User;
  amountCents: number;
  currency?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminSettlementDialog({
  isOpen,
  groupId,
  adminUserId,
  fromUser,
  toUser,
  amountCents,
  currency = 'USD',
  onConfirm,
  onCancel,
}: AdminSettlementDialogProps) {
  const [notes, setNotes] = useState('');
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatAmount = (cents: number) => {
    const amount = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleConfirm = async () => {
    try {
      setRecording(true);
      setError(null);

      await recordAdminSettlement(
        groupId,
        adminUserId,
        fromUser.userId,
        toUser.userId,
        amountCents,
        notes || undefined
      );

      onConfirm();
    } catch (err: any) {
      setError(err.message || 'Failed to record settlement');
      setRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Record Settlement</h2>
          <button
            onClick={onCancel}
            disabled={recording}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Record-Keeping Only</p>
              <p>
                This will update the balance records but will NOT process any actual payment.
                Use this only to record settlements that happened outside the app.
              </p>
            </div>
          </div>

          {/* Settlement Details */}
          <div className="space-y-4">
            {/* From User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid by
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ProfilePictureDisplay
                  userId={fromUser.userId}
                  pictureUrl={fromUser.profilePicture}
                  name={fromUser.name}
                  size="medium"
                />
                <span className="font-semibold text-gray-900">{fromUser.name}</span>
              </div>
            </div>

            {/* To User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid to
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ProfilePictureDisplay
                  userId={toUser.userId}
                  pictureUrl={toUser.profilePicture}
                  name={toUser.name}
                  size="medium"
                />
                <span className="font-semibold text-gray-900">{toUser.name}</span>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <DollarSign className="text-green-600" size={20} />
                <span className="text-2xl font-bold text-green-700">
                  {formatAmount(amountCents)}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Paid in cash, Venmo transfer, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                disabled={recording}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={recording}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={recording}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {recording ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Recording...
              </>
            ) : (
              'Record Settlement'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
