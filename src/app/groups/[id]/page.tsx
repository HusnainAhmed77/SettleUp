'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AddExpenseForm from '@/components/AddExpenseForm';
import SettleUpModal from '@/components/SettleUpModal';
import AddFriendModal from '@/components/AddFriendModal';
import AdminBadge from '@/components/AdminBadge';
import AdminSettlementButton from '@/components/AdminSettlementButton';
import GroupPageWrapper from '@/components/GroupPageWrapper';
import { ArrowRight, Plus, Users, Calculator, ArrowLeft, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { currentUser as mockCurrentUser } from '@/lib/mockData';
import {
  buildLedger,
  computeNetBalances,
  simplifyDebts,
  formatCents,
  getBalanceBetween,
} from '@/lib/split';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenseOperations } from '@/hooks/useExpenseOperations';
import { groupComputationService } from '@/services/groupComputationService';
import { useUserProfilePictures } from '@/hooks/useUserProfilePictures';

export const dynamic = 'force-dynamic';

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params?.id as string;
  
  return (
    <GroupPageWrapper groupId={groupId}>
      {({ group, groupData, loading, error, refresh, useJsonSystem }) => (
        <GroupDetailPageContent 
          group={group}
          groupData={groupData}
          loading={loading}
          error={error}
          refresh={refresh}
          useJsonSystem={useJsonSystem}
        />
      )}
    </GroupPageWrapper>
  );
}

function GroupDetailPageContent({ 
  group, 
  groupData, 
  loading, 
  error, 
  refresh, 
  useJsonSystem 
}: {
  group: any;
  groupData: any;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
  useJsonSystem: boolean;
}) {
  const params = useParams();
  const groupId = params?.id as string;
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [settleUpData, setSettleUpData] = useState<{
    from: string;
    to: string;
    fromName: string;
    toName: string;
    amountCents: number;
  } | null>(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  
  const userCurrency = useCurrency();
  const { user } = useAuth();
  
  // Get all unique user IDs from group members for profile picture fetching
  const allUserIds = useMemo(() => {
    if (!group) return [];
    return group.members.map(member => member.id);
  }, [group]);
  
  // Fetch profile pictures for all users
  const profilePictures = useUserProfilePictures(allUserIds);
  
  // Use expense operations hook
  const { recordSettlement } = useExpenseOperations({
    groupId,
    useJsonSystem,
    onSuccess: refresh,
  });
  
  // Determine admin - the user who created the group (userId field)
  const adminUserId = group?.userId || '';
  const isCurrentUserAdmin = user?.$id === adminUserId;
  
  // Debug logging
  console.log('[Admin Debug]', {
    groupUserId: group?.userId,
    currentUserId: user?.$id,
    adminUserId,
    isCurrentUserAdmin,
    groupName: group?.name,
    useJsonSystem,
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="border-2 border-[#FF007F]">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-[#333333]">Loading group...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="border-2 border-[#FF007F]">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-[#333333]">
              {error ? 'Error loading group' : 'Group not found'}
            </h2>
            {error && <p className="text-red-500 mb-4">{error.message}</p>}
            <Link href="/dashboard">
              <Button className="bg-[#FF007F] hover:bg-[#00CFFF] text-white">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use authenticated user ID or fall back to mock user
  const currentUserId = user?.$id || mockCurrentUser.id;
  
  console.log('[Group Stats Debug]', {
    currentUserId,
    groupMembers: group.members,
    groupExpenses: group.expenses,
    memberIds: group.members.map(m => m.id),
    useJsonSystem,
  });
  
  // Use pre-computed data from JSON if available, otherwise compute on the fly
  const userIds = useMemo(() => group.members.map(m => m.id), [group.members]);
  
  const ledger = useMemo(() => {
    if (useJsonSystem && groupData?.computed?.ledger) {
      // Convert plain object to Map for compatibility
      return groupComputationService.ledgerObjectToMap(groupData.computed.ledger, userIds);
    }
    return buildLedger(group.expenses, userIds, group.settlements);
  }, [useJsonSystem, groupData, group.expenses, userIds, group.settlements]);
  
  const balances = useMemo(() => {
    if (useJsonSystem && groupData?.computed?.netBalances) {
      return groupData.computed.netBalances;
    }
    return computeNetBalances(ledger, userIds);
  }, [useJsonSystem, groupData, ledger, userIds]);
  
  const settlements = useMemo(() => {
    if (useJsonSystem && groupData?.computed?.simplifiedSettlements) {
      return groupData.computed.simplifiedSettlements;
    }
    return simplifyDebts(balances);
  }, [useJsonSystem, groupData, balances]);
  
  console.log('[Group Stats Debug]', {
    ledger,
    balances,
    settlements,
    usingPrecomputed: useJsonSystem && !!groupData?.computed,
  });
  
  const myBalance = balances.find(b => b.userId === currentUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Facets Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-[#FF007F] hover:text-[#00CFFF] mb-4 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-[#333333]">{group.name}</h1>
              <p className="text-[#666666] text-lg">{group.description}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="gap-2 bg-[#FF007F] hover:bg-[#00CFFF] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setShowAddExpense(true)}
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Balances */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`border-2 border-gray-200 ${
                myBalance && myBalance.netCents > 0 ? 'bg-gradient-to-br from-[#10B981]/5 to-white' :
                myBalance && myBalance.netCents < 0 ? 'bg-gradient-to-br from-[#FF6B35]/5 to-white' :
                'bg-gradient-to-br from-[#FF007F]/5 to-white'
              } shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-[#333333] flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    Your Balance in This Group
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-5xl font-bold text-[#333333] mb-2">
                        {formatCents(Math.abs(myBalance?.netCents || 0), userCurrency)}
                      </p>
                      <div className="flex items-center gap-2">
                        {myBalance && myBalance.netCents > 0 && (
                          <>
                            <TrendingUp className="w-5 h-5 text-[#10B981]" />
                            <p className="text-[#10B981] font-semibold text-lg">You are owed</p>
                          </>
                        )}
                        {myBalance && myBalance.netCents < 0 && (
                          <>
                            <TrendingDown className="w-5 h-5 text-[#FF6B35]" />
                            <p className="text-[#FF6B35] font-semibold text-lg">You owe</p>
                          </>
                        )}
                        {myBalance && myBalance.netCents === 0 && (
                          <p className="text-[#FF007F] font-semibold text-lg">✓ All settled up!</p>
                        )}
                      </div>
                    </div>
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-6xl bg-white shadow-lg">
                      {myBalance && myBalance.netCents > 0 && '💰'}
                      {myBalance && myBalance.netCents < 0 && '💸'}
                      {myBalance && myBalance.netCents === 0 && '✅'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Simplified Settlements */}
            {settlements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 border-gray-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-[#333333]">
                        <Calculator className="w-6 h-6 text-[#FF007F]" />
                        Suggested Settlements
                      </CardTitle>
                      <Badge className="bg-[#FF007F] text-white">Simplified</Badge>
                    </div>
                    <p className="text-sm text-[#666666] mt-2">Easiest way to settle all balances</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {settlements.map((settlement, index) => {
                        const fromUser = group.members.find(m => m.id === settlement.from);
                        const toUser = group.members.find(m => m.id === settlement.to);
                        const isMySettlement = settlement.from === currentUserId || settlement.to === currentUserId;
                        
                        const handleSettleUp = () => {
                          setSettleUpData({
                            from: settlement.from,
                            to: settlement.to,
                            fromName: fromUser?.name || '',
                            toName: toUser?.name || '',
                            amountCents: settlement.amountCents
                          });
                        };
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${
                              isMySettlement 
                                ? 'bg-[#FF007F]/10 border-[#FF007F] shadow-md' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Avatar 
                              src={profilePictures[settlement.from] || fromUser?.avatar} 
                              alt={fromUser?.name} 
                              initials={fromUser?.name} 
                              size="lg" 
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-[#333333] text-lg mb-1">
                                {fromUser?.name}
                                {settlement.from === currentUserId && <span className="text-[#FF007F]"> (you)</span>}
                                <span className="text-[#666666] font-normal"> pays </span>
                                {toUser?.name}
                                {settlement.to === currentUserId && <span className="text-[#FF007F]"> (you)</span>}
                              </p>
                              <p className="text-3xl font-bold text-[#FF007F]">
                                {formatCents(settlement.amountCents, userCurrency)}
                              </p>
                            </div>
                            <ArrowRight className="w-8 h-8 text-[#FF007F]" />
                            <Avatar 
                              src={profilePictures[settlement.to] || toUser?.avatar} 
                              alt={toUser?.name} 
                              initials={toUser?.name} 
                              size="lg" 
                            />
                            <div className="flex flex-col gap-2">
                              {isMySettlement && (
                                <Button 
                                  size="sm" 
                                  className="bg-[#FF007F] hover:bg-[#00CFFF] text-white"
                                  onClick={handleSettleUp}
                                >
                                  Settle Up
                                </Button>
                              )}
                              {isCurrentUserAdmin && !isMySettlement && (
                                <AdminSettlementButton
                                  groupId={groupId}
                                  adminUserId={adminUserId}
                                  fromUser={{
                                    userId: settlement.from,
                                    name: fromUser?.name || '',
                                    profilePicture: fromUser?.avatar
                                  }}
                                  toUser={{
                                    userId: settlement.to,
                                    name: toUser?.name || '',
                                    profilePicture: toUser?.avatar
                                  }}
                                  amountCents={settlement.amountCents}
                                  currency={userCurrency}
                                  onSettle={async () => {
                                    // Admin settling debt between two users
                                    await recordSettlement(settlement.from, settlement.to, settlement.amountCents);
                                    // Explicitly refresh the page data
                                    await refresh();
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recent Expenses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-[#333333]">
                      <Receipt className="w-6 h-6 text-[#FF007F]" />
                      Recent Expenses
                    </CardTitle>
                    <Link href={`/groups/${groupId}/expenses`}>
                      <Button variant="ghost" size="sm" className="text-[#FF007F] hover:text-[#00CFFF]">
                        View All →
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {group.expenses.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-[#e8f5f3] to-white rounded-xl border-2 border-dashed border-[#FF007F]">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#FF007F]/10 rounded-full flex items-center justify-center">
                        <Receipt className="w-8 h-8 text-[#FF007F]" />
                      </div>
                      <p className="text-[#666666] font-medium">No expenses yet</p>
                      <p className="text-[#999999] text-sm mt-1">Add your first expense to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {group.expenses.slice(0, 5).map((expense, index) => {
                        const payer = group.members.find(m => m.id === expense.payerId);
                        const myShare = expense.splits.find(s => s.userId === currentUserId);
                        
                        return (
                          <motion.div 
                            key={expense.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#e8f5f3] border-2 border-transparent hover:border-[#FF007F] transition-all duration-300"
                          >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md bg-[#00CFFF]">
                              💳
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-[#333333] text-lg">{expense.title}</p>
                              <p className="text-sm text-[#666666]">
                                {payer?.name}
                                {expense.payerId === currentUserId && <span className="text-[#FF007F]"> (you)</span>}
                                {' '}paid {formatCents(expense.amountCents, userCurrency)}
                              </p>
                            </div>
                            {myShare && (
                              <div className="text-right bg-white px-4 py-2 rounded-lg border-2 border-gray-200 shadow">
                                <p className="text-xs text-[#666666] font-medium">YOUR SHARE</p>
                                <p className="font-bold text-[#FF007F] text-lg">
                                  {formatCents(myShare.amountCents, userCurrency)}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Members & Balances */}
          <div className="space-y-6">
            {/* Group Members */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-[#333333]">
                      <Users className="w-6 h-6 text-[#FF007F]" />
                      Group Members ({group.members.length})
                    </CardTitle>
                    <Button 
                      size="sm" 
                      className="bg-[#FF007F] hover:bg-[#00CFFF] text-white gap-1"
                      onClick={() => setShowAddFriend(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Friend
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {group.members.map((member, index) => {
                      const balance = balances.find(b => b.userId === member.id);
                      const netCents = balance?.netCents || 0;
                      
                      // Get detailed breakdown - show NET balance between each pair
                      const owesTo: { name: string; amount: number }[] = [];
                      const owedBy: { name: string; amount: number }[] = [];
                      
                      group.members.forEach(otherMember => {
                        if (otherMember.id !== member.id) {
                          const memberOwesOther = ledger.get(member.id)?.get(otherMember.id) || 0;
                          const otherOwesMember = ledger.get(otherMember.id)?.get(member.id) || 0;
                          
                          // Calculate NET balance
                          const netBalance = otherOwesMember - memberOwesOther;
                          
                          if (netBalance > 0) {
                            // Other person owes this member (net)
                            owedBy.push({ name: otherMember.name, amount: netBalance });
                          } else if (netBalance < 0) {
                            // This member owes other person (net)
                            owesTo.push({ name: otherMember.name, amount: Math.abs(netBalance) });
                          }
                        }
                      });
                      
                      return (
                        <motion.div 
                          key={member.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="border-2 border-gray-200 bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar 
                              src={profilePictures[member.id] || member.avatar} 
                              alt={member.name} 
                              initials={member.name} 
                              size="lg" 
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-[#333333] text-lg">
                                  {member.name}
                                </p>
                                <AdminBadge isAdmin={member.id === adminUserId} size="small" />
                              </div>
                              <p className="text-sm font-medium">
                                {netCents > 0 && <span className="text-[#10B981]">gets back {formatCents(netCents, userCurrency)}</span>}
                                {netCents < 0 && <span className="text-[#FF6B35]">owes {formatCents(Math.abs(netCents), userCurrency)}</span>}
                                {netCents === 0 && <span className="text-[#FF007F]">settled up</span>}
                              </p>
                            </div>
                            {netCents > 0 && <Badge className="bg-[#10B981] text-white" size="sm">+</Badge>}
                            {netCents < 0 && <Badge className="bg-[#FF6B35] text-white" size="sm">-</Badge>}
                            {netCents === 0 && <Badge className="bg-[#FF007F] text-white" size="sm">✓</Badge>}
                          </div>
                          
                          {/* Detailed breakdown */}
                          {(owesTo.length > 0 || owedBy.length > 0) && (
                            <div className="mt-3 pt-3 border-t-2 border-gray-200 space-y-2 text-sm">
                              {owesTo.map((debt, idx) => (
                                <div key={`owes-${idx}`} className="flex items-center justify-between text-[#FF6B35] bg-[#FF6B35]/5 p-2 rounded-lg">
                                  <span className="font-medium">→ owes {debt.name}</span>
                                  <span className="font-bold">{formatCents(debt.amount, userCurrency)}</span>
                                </div>
                              ))}
                              {owedBy.map((credit, idx) => (
                                <div key={`owed-${idx}`} className="flex items-center justify-between text-[#10B981] bg-[#10B981]/5 p-2 rounded-lg">
                                  <span className="font-medium">← {credit.name} owes them</span>
                                  <span className="font-bold">{formatCents(credit.amount, userCurrency)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Your Individual Balances */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#333333]">Your Individual Balances</CardTitle>
                  <p className="text-sm text-[#666666] mt-1">How much you owe or are owed by each member</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.members
                      .filter(m => m.id !== currentUserId)
                      .map((member, index) => {
                        const balance = getBalanceBetween(ledger, currentUserId, member.id);
                        
                        return (
                          <motion.div 
                            key={member.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 shadow transition-all duration-300 ${
                              balance === 0 
                                ? 'bg-[#FF007F]/5' 
                                : balance > 0 
                                  ? 'bg-[#10B981]/5' 
                                  : 'bg-[#FF6B35]/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar 
                                src={profilePictures[member.id] || member.avatar} 
                                alt={member.name} 
                                initials={member.name} 
                                size="md" 
                              />
                              <span className="font-semibold text-[#333333]">{member.name}</span>
                            </div>
                            <div className="text-right">
                              {balance === 0 ? (
                                <p className="font-bold text-[#FF007F]">Settled up</p>
                              ) : (
                                <>
                                  <p className={`font-bold text-xl ${balance > 0 ? 'text-[#10B981]' : 'text-[#FF6B35]'}`}>
                                    {formatCents(Math.abs(balance), userCurrency)}
                                  </p>
                                  <p className="text-xs font-medium text-[#666666]">
                                    {balance > 0 ? 'owes you' : 'you owe'}
                                  </p>
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && group && (
          <AddExpenseForm
            groupId={groupId}
            members={group.members}
            onClose={() => setShowAddExpense(false)}
            onSuccess={() => {
              refresh();
              setShowAddExpense(false);
            }}
            useJsonSystem={useJsonSystem}
          />
        )}

        {/* Settle Up Modal */}
        {settleUpData && (
          <SettleUpModal
            fromName={settleUpData.fromName}
            toName={settleUpData.toName}
            totalAmountCents={settleUpData.amountCents}
            onConfirm={async (amountCents) => {
              try {
                await recordSettlement(
                  settleUpData.from,
                  settleUpData.to,
                  amountCents
                );
                // Explicitly refresh the page data
                await refresh();
                setSettleUpData(null);
              } catch (error) {
                console.error('Error recording settlement:', error);
                alert('Failed to record settlement. Please try again.');
              }
            }}
            onClose={() => setSettleUpData(null)}
          />
        )}

        {/* Add Friend Modal */}
        {showAddFriend && (
          <AddFriendModal
            onClose={() => setShowAddFriend(false)}
            onSuccess={() => {
              refresh();
              setShowAddFriend(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
