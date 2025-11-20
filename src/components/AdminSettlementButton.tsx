'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import AdminSettlementDialog from './AdminSettlementDialog';

interface User {
  userId: string;
  name: string;
  profilePicture?: string;
}

interface AdminSettlementButtonProps {
  groupId: string;
  adminUserId: string;
  fromUser: User;
  toUser: User;
  amountCents: number;
  currency?: string;
  onSettle: () => void;
  className?: string;
}

export default function AdminSettlementButton({
  groupId,
  adminUserId,
  fromUser,
  toUser,
  amountCents,
  currency = 'USD',
  onSettle,
  className = '',
}: AdminSettlementButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirm = () => {
    setIsDialogOpen(false);
    onSettle();
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium ${className}`}
        title="Record settlement as admin"
      >
        <Shield size={16} />
        Settle as Admin
      </button>

      <AdminSettlementDialog
        isOpen={isDialogOpen}
        groupId={groupId}
        adminUserId={adminUserId}
        fromUser={fromUser}
        toUser={toUser}
        amountCents={amountCents}
        currency={currency}
        onConfirm={handleConfirm}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
}
