'use client';

import { UpcomingExpense } from '@/lib/split';
import { Group, User } from '@/lib/mockData';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar, { AvatarGroup } from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { Users, Receipt, Edit, Trash } from 'lucide-react';
import { formatCents } from '@/lib/split';
import { formatDateBadge, getDateBadgeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UpcomingExpenseCardProps {
  expense: UpcomingExpense;
  group: Group;
  onEdit: (expense: UpcomingExpense) => void;
  onDelete: (expense: UpcomingExpense) => void;
  onConvert: (expense: UpcomingExpense) => void;
}

export default function UpcomingExpenseCard({
  expense,
  group,
  onEdit,
  onDelete,
  onConvert,
}: UpcomingExpenseCardProps) {
  const getSplitTypeIcon = () => {
    switch (expense.splitType) {
      case 'equal':
        return '=';
      case 'percentage':
        return '%';
      case 'exact':
        return '$';
    }
  };

  const getUserName = (userId: string): string => {
    const user = group.members.find(m => m.id === userId);
    return user?.name || 'Unknown';
  };

  // Ensure date is a Date object for consistent rendering
  const targetDate = expense.targetDate instanceof Date 
    ? expense.targetDate 
    : new Date(expense.targetDate);

  return (
    <Card className="border-2 border-gray-200 hover:border-[#3cc9bb] hover:shadow-xl transition-all duration-300 bg-white">
      <CardHeader>
        {/* Date Badge and Split Type */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={cn('border', getDateBadgeColor(targetDate))}>
            {formatDateBadge(targetDate)}
          </Badge>
          <Badge variant="default" className="text-xs font-mono">
            {getSplitTypeIcon()}
          </Badge>
        </div>
        
        {/* Title and Group */}
        <CardTitle className="text-xl mb-2 text-[#333333]">{expense.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <Users className="w-4 h-4" />
          <span>{group.name}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Amount */}
        <div className="mb-4">
          <p className="text-sm text-[#666666] mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-[#333333]">
            {formatCents(expense.amountCents)}
          </p>
        </div>
        
        {/* Participants */}
        <div className="mb-4">
          <p className="text-sm text-[#666666] mb-2">
            {expense.participants.length} participant{expense.participants.length !== 1 ? 's' : ''}
          </p>
          <AvatarGroup max={5} size="sm">
            {expense.participants.map(userId => (
              <Avatar
                key={userId}
                initials={getUserName(userId)}
                alt={getUserName(userId)}
              />
            ))}
          </AvatarGroup>
        </div>
        
        {/* Split Preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-[#666666] mb-2 font-medium">Split breakdown</p>
          <div className="space-y-1">
            {Object.entries(expense.splits).slice(0, 3).map(([userId, amount]) => (
              <div key={userId} className="flex justify-between text-sm">
                <span className="text-[#666666]">{getUserName(userId)}</span>
                <span className="font-medium text-[#333333]">
                  {expense.splitType === 'percentage' 
                    ? `${amount}%` 
                    : formatCents(amount)}
                </span>
              </div>
            ))}
            {Object.keys(expense.splits).length > 3 && (
              <p className="text-xs text-[#999999] pt-1">
                +{Object.keys(expense.splits).length - 3} more
              </p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1 bg-[#3cc9bb] hover:bg-[#35b3a7]"
            onClick={() => onConvert(expense)}
          >
            <Receipt className="w-4 h-4 mr-1" />
            Record
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(expense)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(expense)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
