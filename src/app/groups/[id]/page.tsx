'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AddExpenseForm from '@/components/AddExpenseForm';
import { useGroup } from '@/hooks/useStore';
import { ArrowRight, Plus, Users, Calculator, ArrowLeft, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { currentUser } from '@/lib/mockData';
import {
  buildLedger,
  computeNetBalances,
  simplifyDebts,
  formatCents,
  getBalanceBetween,
} from '@/lib/split';
import { dataStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params?.id as string;
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const group = useGroup(groupId);
  
  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="border-2 border-[#FF007F]">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-[#333333]">Group not found</h2>
            <Link href="/dashboard">
              <Button className="bg-[#FF007F] hover:bg-[#00CFFF] text-white">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userIds = group.members.map(m => m.id);
  const ledger = useMemo(() => buildLedger(group.expenses, userIds), [group.expenses, userIds]);
  const balances = useMemo(() => computeNetBalances(ledger, userIds), [ledger, userIds]);
  const settlements = useMemo(() => simplifyDebts(balances), [balances]);
  
  const myBalance = balances.find(b => b.userId === currentUser.id);

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
            <Button
              variant="primary"
              className="gap-2 bg-[#FF007F] hover:bg-[#00CFFF] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowAddExpense(true)}
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </Button>
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
              <Card className={`border-2 ${
                myBalance && myBalance.netCents > 0 ? 'border-[#10B981] bg-gradient-to-br from-[#10B981]/5 to-white' :
                myBalance && myBalance.netCents < 0 ? 'border-[#FF6B35] bg-gradient-to-br from-[#FF6B35]/5 to-white' :
                'border-[#FF007F] bg-gradient-to-br from-[#FF007F]/5 to-white'
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
                        {formatCents(Math.abs(myBalance?.netCents || 0))}
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
                <Card className="border-2 border-[#FF007F] shadow-lg">
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
                        const isMySettlement = settlement.from === currentUser.id || settlement.to === currentUser.id;
                        
                        const handleSettleUp = () => {
                          if (confirm(`Record payment of ${formatCents(settlement.amountCents)} from ${fromUser?.name} to ${toUser?.name}?`)) {
                            dataStore.recordPayment(
                              groupId,
                              settlement.from,
                              settlement.to,
                              settlement.amountCents
                            );
                          }
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
                            <Avatar alt={fromUser?.name} initials={fromUser?.name} size="lg" />
                            <div className="flex-1">
                              <p className="font-semibold text-[#333333] text-lg mb-1">
                                {fromUser?.name}
                                {settlement.from === currentUser.id && <span className="text-[#FF007F]"> (you)</span>}
                                <span className="text-[#666666] font-normal"> pays </span>
                                {toUser?.name}
                                {settlement.to === currentUser.id && <span className="text-[#FF007F]"> (you)</span>}
                              </p>
                              <p className="text-3xl font-bold text-[#FF007F]">
                                {formatCents(settlement.amountCents)}
                              </p>
                            </div>
                            <ArrowRight className="w-8 h-8 text-[#FF007F]" />
                            <Avatar alt={toUser?.name} initials={toUser?.name} size="lg" />
                            {isMySettlement && (
                              <Button 
                                size="sm" 
                                className="bg-[#FF007F] hover:bg-[#00CFFF] text-white"
                                onClick={handleSettleUp}
                              >
                                Settle Up
                              </Button>
                            )}
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
                        const myShare = expense.splits.find(s => s.userId === currentUser.id);
                        
                        return (
                          <motion.div 
                            key={expense.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#e8f5f3] border-2 border-transparent hover:border-[#FF007F] transition-all duration-300"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#00CFFF] flex items-center justify-center text-2xl shadow-md">
                              💳
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-[#333333] text-lg">{expense.title}</p>
                              <p className="text-sm text-[#666666]">
                                {payer?.name}
                                {expense.payerId === currentUser.id && <span className="text-[#FF007F]"> (you)</span>}
                                {' '}paid {formatCents(expense.amountCents)}
                              </p>
                            </div>
                            {myShare && (
                              <div className="text-right bg-white px-4 py-2 rounded-lg border-2 border-[#FF007F]">
                                <p className="text-xs text-[#666666] font-medium">YOUR SHARE</p>
                                <p className="font-bold text-[#FF007F] text-lg">
                                  {formatCents(myShare.amountCents)}
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
              <Card className="border-2 border-[#FF007F] shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#333333]">
                    <Users className="w-6 h-6 text-[#FF007F]" />
                    Group Members ({group.members.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {group.members.map((member, index) => {
                      const balance = balances.find(b => b.userId === member.id);
                      const netCents = balance?.netCents || 0;
                      const isCurrentUser = member.id === currentUser.id;
                      
                      // Get detailed breakdown
                      const owesTo: { name: string; amount: number }[] = [];
                      const owedBy: { name: string; amount: number }[] = [];
                      
                      group.members.forEach(otherMember => {
                        if (otherMember.id !== member.id) {
                          const amount = ledger.get(member.id)?.get(otherMember.id) || 0;
                          if (amount > 0) {
                            owesTo.push({ name: otherMember.name, amount });
                          }
                          
                          const owedAmount = ledger.get(otherMember.id)?.get(member.id) || 0;
                          if (owedAmount > 0) {
                            owedBy.push({ name: otherMember.name, amount: owedAmount });
                          }
                        }
                      });
                      
                      return (
                        <motion.div 
                          key={member.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                            isCurrentUser 
                              ? 'border-[#FF007F] bg-[#FF007F]/5 shadow-md' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar alt={member.name} initials={member.name} size="lg" />
                            <div className="flex-1">
                              <p className="font-semibold text-[#333333] text-lg">
                                {member.name}
                                {isCurrentUser && (
                                  <span className="text-[#FF007F] text-sm ml-2 font-bold">(YOU)</span>
                                )}
                              </p>
                              <p className="text-sm font-medium">
                                {netCents > 0 && <span className="text-[#10B981]">gets back {formatCents(netCents)}</span>}
                                {netCents < 0 && <span className="text-[#FF6B35]">owes {formatCents(Math.abs(netCents))}</span>}
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
                                  <span className="font-bold">{formatCents(debt.amount)}</span>
                                </div>
                              ))}
                              {owedBy.map((credit, idx) => (
                                <div key={`owed-${idx}`} className="flex items-center justify-between text-[#10B981] bg-[#10B981]/5 p-2 rounded-lg">
                                  <span className="font-medium">← {credit.name} owes them</span>
                                  <span className="font-bold">{formatCents(credit.amount)}</span>
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
                      .filter(m => m.id !== currentUser.id)
                      .map((member, index) => {
                        const balance = getBalanceBetween(ledger, currentUser.id, member.id);
                        
                        return (
                          <motion.div 
                            key={member.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                              balance === 0 
                                ? 'bg-[#FF007F]/5 border-[#FF007F]' 
                                : balance > 0 
                                  ? 'bg-[#10B981]/5 border-[#10B981]' 
                                  : 'bg-[#FF6B35]/5 border-[#FF6B35]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar alt={member.name} initials={member.name} size="md" />
                              <span className="font-semibold text-[#333333]">{member.name}</span>
                            </div>
                            <div className="text-right">
                              {balance === 0 ? (
                                <p className="font-bold text-[#FF007F]">Settled up</p>
                              ) : (
                                <>
                                  <p className={`font-bold text-xl ${balance > 0 ? 'text-[#10B981]' : 'text-[#FF6B35]'}`}>
                                    {formatCents(Math.abs(balance))}
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
              // Data will auto-refresh via useGroup hook
            }}
          />
        )}
      </div>
    </div>
  );
}
