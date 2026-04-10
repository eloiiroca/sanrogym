"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, CalendarDays, ChevronLeft, ChevronRight, Crown, Snowflake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

export interface DashboardParticipant {
  id: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  coldStreak: number;
  sessions: { id: string }[];
}

export interface MonthlyRankingData {
  id: string;
  name: string;
  count: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

export function DashboardClient({
  participants,
  monthlyData,
  monthlyRankings,
}: {
  participants: DashboardParticipant[];
  monthlyData: MonthlyData[];
  monthlyRankings: Record<string, MonthlyRankingData[]>;
}) {
  const availableMonths = useMemo(() => {
    return Object.keys(monthlyRankings).sort().reverse();
  }, [monthlyRankings]);

  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const currentMonthKey = availableMonths[selectedMonthIdx];

  const displayMonthName = useMemo(() => {
    if (!currentMonthKey) return "";
    const [year, month] = currentMonthKey.split("-").map(Number);
    return new Date(year, month - 1).toLocaleDateString("ca-ES", {
      month: "short",
      year: "numeric",
    });
  }, [currentMonthKey]);

  const currentMonthlyRanking = useMemo(() => {
    if (!currentMonthKey) return [];
    return [...monthlyRankings[currentMonthKey]].sort((a, b) => b.count - a.count);
  }, [currentMonthKey, monthlyRankings]);

  const mvps = useMemo(() => {
    if (currentMonthlyRanking.length === 0) return [];
    const maxCount = currentMonthlyRanking[0].count;
    if (maxCount === 0) return [];
    return currentMonthlyRanking
      .filter((p) => p.count === maxCount)
      .map((p) => p.id);
  }, [currentMonthlyRanking]);

  const leaderboard = [...participants].sort(
    (a, b) => b.sessions.length - a.sessions.length
  );

  const hotStreaks = [...participants]
    .filter(p => p.currentStreak > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak);

  const coldStreaks = [...participants]
    .filter(p => p.coldStreak > 0)
    .sort((a, b) => b.coldStreak - a.coldStreak);

  const handlePrevMonth = () => {
    if (selectedMonthIdx < availableMonths.length - 1) {
      setSelectedMonthIdx(selectedMonthIdx + 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIdx > 0) {
      setSelectedMonthIdx(selectedMonthIdx - 1);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* LAYER 1: LEADERBOARDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* All-Time Leaderboard */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Rànquing General</CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-4">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm">{p.name}</span>
                  </div>
                  <Badge variant="outline" className="border-primary/50 text-primary text-[10px] h-5">
                    {p.sessions.length} sessions
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Ranking Browser */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Rànquing Mensual</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevMonth} disabled={selectedMonthIdx === availableMonths.length - 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-bold min-w-[70px] text-center">{displayMonthName}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextMonth} disabled={selectedMonthIdx === 0}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div key={currentMonthKey} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-3">
                {currentMonthlyRanking.map((p, idx) => {
                  const isMVP = mvps.includes(p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3 relative overflow-hidden">
                      {isMVP && <div className="absolute top-0 right-0 p-1"><Crown className="h-3 w-3 text-primary fill-primary opacity-20" /></div>}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-4">{idx + 1}</span>
                        <span className="font-medium text-sm flex items-center gap-2">
                          {p.name}
                          {isMVP && <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] h-4 px-1.5 uppercase font-black">MVP</Badge>}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-primary">{p.count}</span>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* LAYER 2: STREAKS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hot Streaks */}
        <Card className="border-orange-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Ratxa de Sessions</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotStreaks.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">Encara ningú està on fire!</p>
              ) : (
                hotStreaks.map((p, idx) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm flex items-center gap-2">
                        {p.name}
                        {p.currentStreak >= 3 && (
                          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            <Flame className="h-3 w-3 fill-orange-500 text-orange-500" />
                          </motion.span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-orange-500">{p.currentStreak} sessions</span>
                      <span className="text-[8px] text-muted-foreground uppercase tracking-tighter">Millor: {p.longestStreak}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cold Streaks */}
        <Card className="border-blue-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Ratxa de Pechofriadas</CardTitle>
            <Snowflake className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coldStreaks.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">Tothom està venint al gimnàs! 🏋️</p>
              ) : (
                coldStreaks.map((p, idx) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm flex items-center gap-2">
                        {p.name}
                        {p.coldStreak >= 3 && <Snowflake className="h-3 w-3 text-blue-400 opacity-50" />}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-blue-400">{p.coldStreak} sessions perdudes</span>
                      <span className="text-[8px] text-muted-foreground uppercase tracking-tighter">És hora de tornar!</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LAYER 3: MONTHLY VOLUME */}
      <Card className="bg-card/50 backdrop-blur-sm border-muted p-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-bold">Volum Mensual</h3>
            <p className="text-sm text-muted-foreground">Sessions totals de grup per mes.</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} />
              <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', fontSize: '11px', padding: '8px' }} itemStyle={{ color: '#fb923c' }} />
              <Bar dataKey="count" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
