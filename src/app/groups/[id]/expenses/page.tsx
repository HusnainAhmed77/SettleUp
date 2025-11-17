'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, Plus, Receipt, Users, Calendar, DollarSign } from 'lucide-react';
import { useGroup } from '@/hooks/useStore';
import { currentUser } from '@/lib/mockData';
import { formatCents } from '@/lib/split';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';

export default function GroupExpensesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const group = useGroup(id);

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

  // Calculate total expenses
  const totalExpenses = group.expenses.reduce((sum, exp) => sum + exp.amountCents, 0);
  const yourExpenses = group.expenses.filter(exp => exp.payerId === currentUser.id).reduce((sum, exp) => sum + exp.amountCents, 0);

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
            href={`/groups/${id}`}
            className="inline-flex items-center gap-2 text-[#FF007F] hover:text-[#00CFFF] mb-4 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {group.name}
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-[#333333]">All Expenses</h1>
              <p className="text-[#666666] text-lg">Complete expense history for {group.name}</p>
            </div>
            <Button
              variant="primary"
              className="gap-2 bg-[#FF007F] hover:bg-[#00CFFF] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-[#FF007F] shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#666666] text-sm font-medium mb-2">TOTAL EXPENSES</p>
                    <h2 className="text-3xl font-bold text-[#333333]">
                      {formatCents(totalExpenses)}
                    </h2>
                    <p className="text-[#999999] text-sm mt-1">{group.expenses.length} transactions</p>
                  </div>
                  <div className="w-14 h-14 bg-[#FF007F]/10 rounded-full flex items-center justify-center">
                    <Receipt className="w-7 h-7 text-[#FF007F]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-[#10B981] shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#666666] text-sm font-medium mb-2">YOU PAID</p>
                    <h2 className="text-3xl font-bold text-[#10B981]">
                      {formatCents(yourExpenses)}
                    </h2>
                    <p className="text-[#999999] text-sm mt-1">
                      {group.expenses.filter(exp => exp.payerId === currentUser.id).length} expenses
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#666666] text-sm font-medium mb-2">GROUP MEMBERS</p>
                    <h2 className="text-3xl font-bold text-[#333333]">
                      {group.members.length}
                    </h2>
                    <p className="text-[#999999] text-sm mt-1">Active participants</p>
                  </div>
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-[#666666]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#333333]">
                <Receipt className="w-6 h-6 text-[#FF007F]" />
                Expense History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {group.expenses.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-[#e8f5f3] to-white rounded-xl border-2 border-dashed border-[#FF007F]">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#FF007F]/10 rounded-full flex items-center justify-center">
                    <Receipt className="w-10 h-10 text-[#FF007F]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#333333]">No expenses yet</h3>
                  <p className="text-[#666666] mb-6">Start tracking expenses for this group</p>
                  <Button className="bg-[#FF007F] hover:bg-[#00CFFF] text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Expense
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {group.expenses.map((expense, index) => {
                    const payer = group.members.find(m => m.id === expense.payerId);
                    const myShare = expense.splits.find(s => s.userId === currentUser.id);
                    const isPaidByYou = expense.payerId === currentUser.id;
                    
                    return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                          isPaidByYou 
                            ? 'bg-[#10B981]/5 border-[#10B981] hover:border-[#10B981]' 
                            : 'bg-white border-gray-200 hover:border-[#FF007F]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md ${
                            isPaidByYou 
                              ? 'bg-gradient-to-br from-[#10B981] to-[#059669]' 
                              : 'bg-[#00CFFF]'
                          }`}>
                            💳
                          </div>

                          {/* Expense Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-[#333333] text-lg">{expense.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <div className="flex items-center gap-1 text-[#666666] text-sm">
                                    <Avatar alt={payer?.name} initials={payer?.name} size="xs" />
                                    <span>
                                      {payer?.name}
                                      {isPaidByYou && <span className="text-[#10B981] font-semibold"> (you)</span>}
                                      {' '}paid
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[#666666] text-sm">
                                    <Users className="w-3 h-3" />
                                    <span>{expense.splits.length} people</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[#666666] text-sm">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-[#333333]">
                                  {formatCents(expense.amountCents)}
                                </p>
                                {isPaidByYou && (
                                  <Badge className="bg-[#10B981] text-white mt-1">You paid</Badge>
                                )}
                              </div>
                            </div>

                            {/* Your Share */}
                            {myShare && (
                              <div className="mt-3 pt-3 border-t-2 border-gray-200 flex items-center justify-between">
                                <span className="text-sm font-medium text-[#666666]">YOUR SHARE:</span>
                                <span className="text-lg font-bold text-[#FF007F]">
                                  {formatCents(myShare.amountCents)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
