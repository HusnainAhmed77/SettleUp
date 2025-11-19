'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Users, TrendingUp, TrendingDown, ArrowRight, Wallet, Receipt, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar, { AvatarGroup } from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import CreateGroupForm from '@/components/CreateGroupForm';
import UpcomingExpensesSection from '@/components/UpcomingExpensesSection';
import { currentUser } from '@/lib/mockData';
import { buildLedger, computeNetBalances, formatCents, getCurrentMonthSpending } from '@/lib/split';
import { useGroups } from '@/hooks/useStore';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const groups = useGroups();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Compute overall balance across all groups
  const overallBalance = useMemo(() => {
    let totalNet = 0;
    
    groups.forEach(group => {
      const userIds = group.members.map(m => m.id);
      const ledger = buildLedger(group.expenses, userIds);
      const balances = computeNetBalances(ledger, userIds);
      const myBalance = balances.find(b => b.userId === currentUser.id);
      if (myBalance) {
        totalNet += myBalance.netCents;
      }
    });
    
    return totalNet;
  }, [groups]);

  // Compute balance for each group
  const groupBalances = useMemo(() => {
    return groups.map(group => {
      const userIds = group.members.map(m => m.id);
      const ledger = buildLedger(group.expenses, userIds);
      const balances = computeNetBalances(ledger, userIds);
      const myBalance = balances.find(b => b.userId === currentUser.id);
      
      return {
        groupId: group.id,
        netCents: myBalance?.netCents || 0,
      };
    });
  }, [groups]);

  // Calculate totals for you owe and you are owed
  const { youOwe, youAreOwed } = useMemo(() => {
    let owe = 0;
    let owed = 0;
    
    groupBalances.forEach(balance => {
      if (balance.netCents < 0) {
        owe += Math.abs(balance.netCents);
      } else if (balance.netCents > 0) {
        owed += balance.netCents;
      }
    });
    
    return { youOwe: owe, youAreOwed: owed };
  }, [groupBalances]);

  // Calculate monthly spending
  const monthlySpending = useMemo(() => {
    const allExpenses = groups.flatMap(group => group.expenses);
    return getCurrentMonthSpending(allExpenses, currentUser.id);
  }, [groups]);

  // Calculate spending by group for pie chart
  const spendingByGroup = useMemo(() => {
    return groups.map(group => ({
      name: group.name,
      value: group.expenses
        .filter(exp => exp.payerId === currentUser.id)
        .reduce((sum, exp) => sum + exp.amountCents, 0) / 100,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    })).filter(item => item.value > 0);
  }, [groups]);

  // Calculate activity stats
  const activityStats = useMemo(() => {
    const allExpenses = groups.flatMap(group => group.expenses);
    return {
      totalExpenses: allExpenses.length,
      totalGroups: groups.length,
      totalMembers: new Set(groups.flatMap(g => g.members.map(m => m.id))).size,
    };
  }, [groups]);

  // Calculate progress towards settlement
  const settlementProgress = useMemo(() => {
    const total = youOwe + youAreOwed;
    if (total === 0) return 100;
    const settled = Math.max(0, total - Math.abs(overallBalance));
    return Math.round((settled / total) * 100);
  }, [youOwe, youAreOwed, overallBalance]);

  const COLORS = ['#FF007F', '#00CFFF', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

  return (
    <div className="relative">
      {/* Facets Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Magenta Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF007F]/10 via-transparent to-[#00CFFF]/10 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-[#333333]">
                Welcome back, <span className="text-[#00CFFF]">{currentUser.name}</span>!
              </h1>
              <p className="text-[#666666] text-lg">Here's your financial overview</p>
            </div>
          </div>
        </motion.div>

        {/* Balance Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-[#00CFFF] text-white border-2 border-dashed border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5" />
                      <p className="text-white/90 text-sm font-semibold tracking-wide">TOTAL BALANCE</p>
                    </div>
                    <h2 className="text-5xl font-bold mb-2">
                      {formatCents(Math.abs(overallBalance))}
                    </h2>
                    {overallBalance > 0 && (
                      <div className="flex items-center gap-2 text-white/90">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">You are owed overall</span>
                      </div>
                    )}
                    {overallBalance < 0 && (
                      <div className="flex items-center gap-2 text-white/90">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">You owe overall</span>
                      </div>
                    )}
                    {overallBalance === 0 && (
                      <div className="flex items-center gap-2 text-white/90">
                        <span className="text-sm font-medium">✓ All settled up!</span>
                      </div>
                    )}
                    
                    {/* Monthly Spending with Progress */}
                    <div className="mt-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/90 text-sm font-medium">Spent this month</span>
                        <span className="text-white font-bold text-lg">
                          {formatCents(monthlySpending)}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((monthlySpending / 100000) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-white h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Outstanding Payables */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white border-2 border-dashed border-[#FF6B35]/30 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/5 rounded-full -mr-16 -mt-16" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-[#FF6B35]" />
                      <p className="text-[#666666] text-sm font-semibold tracking-wide">PAYABLES</p>
                    </div>
                    <h2 className="text-4xl font-bold text-[#FF6B35] mb-2">
                      {formatCents(youOwe)}
                    </h2>
                    <p className="text-[#999999] text-sm">Amount you need to pay</p>
                    
                    {/* Progress Bar */}
                    {(youOwe + youAreOwed) > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-[#666666] mb-1">
                          <span>Settlement Progress</span>
                          <span>{settlementProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${settlementProgress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-[#FF6B35] h-2 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Outstanding Receivables */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-2 border-dashed border-[#10B981]/30 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-full -mr-16 -mt-16" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[#10B981]" />
                      <p className="text-[#666666] text-sm font-semibold tracking-wide">RECEIVABLES</p>
                    </div>
                    <h2 className="text-4xl font-bold text-[#10B981] mb-2">
                      {formatCents(youAreOwed)}
                    </h2>
                    <p className="text-[#999999] text-sm">Amount owed to you</p>
                    
                    {/* Activity Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-[#10B981]">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-medium">{activityStats.totalExpenses} transactions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        {spendingByGroup.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Spending by Group Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white shadow-lg border-2 border-dashed border-[#00CFFF]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#333333]">
                    <Receipt className="w-5 h-5 text-[#00CFFF]" />
                    Spending by Group
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={spendingByGroup}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {spendingByGroup.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white shadow-lg border-2 border-dashed border-[#FF007F]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#333333]">
                    <Activity className="w-5 h-5 text-[#FF007F]" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#00CFFF]/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF007F] rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-[#666666]">Active Groups</p>
                          <p className="text-2xl font-bold text-[#333333]">{activityStats.totalGroups}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#00CFFF]/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-[#666666]">Total Expenses</p>
                          <p className="text-2xl font-bold text-[#333333]">{activityStats.totalExpenses}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#00CFFF]/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-[#666666]">Total Members</p>
                          <p className="text-2xl font-bold text-[#333333]">{activityStats.totalMembers}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Groups Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#333333]">Your Groups</h2>
            <p className="text-[#666666] mt-1">Manage your shared expenses</p>
          </div>
          <Button 
            variant="primary" 
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowCreateGroup(true)}
          >
            <Plus className="w-5 h-5" />
            Create Group
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => {
            const balance = groupBalances.find(b => b.groupId === group.id);
            const netCents = balance?.netCents || 0;
            const totalGroupExpenses = group.expenses.length;
            const groupTotal = group.expenses.reduce((sum, exp) => sum + exp.amountCents, 0);
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/groups/${group.id}`}>
                  <Card className="h-full border-2 border-dashed border-[#FF007F]/30 hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden group relative">
                    {/* Gradient Header */}
                    <div className="h-24 bg-[#00CFFF] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                      <div className="absolute inset-0 flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white/80 text-xs font-medium">{group.members.length} members</p>
                            <p className="text-white text-sm font-semibold">{totalGroupExpenses} expenses</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <CardTitle className="mb-2 text-[#333333] text-xl group-hover:text-[#00CFFF] transition-colors">
                          {group.name}
                        </CardTitle>
                        <p className="text-sm text-[#666666] line-clamp-2">{group.description}</p>
                      </div>

                      {/* Members Avatars */}
                      <div className="mb-4">
                        <AvatarGroup max={5} size="sm">
                          {group.members.map(member => (
                            <Avatar
                              key={member.id}
                              alt={member.name}
                              initials={member.name}
                            />
                          ))}
                        </AvatarGroup>
                      </div>

                      {/* Balance Section */}
                      <div className="border-t-2 border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-[#666666] font-medium">Your Balance</p>
                          {netCents > 0 && (
                            <Badge className="bg-[#10B981] text-white text-xs" rounded>
                              receivable
                            </Badge>
                          )}
                          {netCents < 0 && (
                            <Badge className="bg-[#FF6B35] text-white text-xs" rounded>
                              payable
                            </Badge>
                          )}
                          {netCents === 0 && (
                            <Badge className="bg-[#00CFFF] text-white text-xs" rounded>
                              settled
                            </Badge>
                          )}
                        </div>
                        <p className="text-3xl font-bold text-[#333333] mb-3">
                          {formatCents(Math.abs(netCents))}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-[#666666]">
                            <span>Group Total</span>
                            <span>{formatCents(groupTotal)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((Math.abs(netCents) / groupTotal) * 100, 100)}%` }}
                              transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                              className={cn(
                                "h-2 rounded-full",
                                netCents > 0 ? "bg-[#10B981]" : netCents < 0 ? "bg-[#FF6B35]" : "bg-[#00CFFF]"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {groups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-16 border-2 border-dashed border-[#00CFFF] bg-[#E6F9FF]">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-6 bg-[#00CFFF]/10 rounded-full flex items-center justify-center">
                  <Users className="w-12 h-12 text-[#00CFFF]" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#333333]">No groups yet</h3>
                <p className="text-[#666666] mb-8 max-w-md mx-auto">
                  Create your first group to start tracking shared expenses with friends, family, or roommates
                </p>
                <Button 
                  variant="primary"
                  className="shadow-lg px-8 py-3"
                  onClick={() => setShowCreateGroup(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Expenses Section */}
        <UpcomingExpensesSection />

        {/* Create Group Modal */}
        {showCreateGroup && (
          <CreateGroupForm
            onClose={() => setShowCreateGroup(false)}
            onSuccess={() => {
              // Data will auto-refresh via useGroups hook
            }}
          />
        )}
      </div>
    </div>
  );
}
