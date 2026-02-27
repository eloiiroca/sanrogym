"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface DashboardParticipant {
  id: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  sessions: { id: string }[];
}

interface MonthlyData {
  month: string;
  count: number;
}

export function DashboardClient({
  participants,
  monthlyData,
}: {
  participants: DashboardParticipant[];
  monthlyData: MonthlyData[];
}) {
  const leaderboard = [...participants].sort(
    (a, b) => b.sessions.length - a.sessions.length
  );

  const streaks = [...participants].sort(
    (a, b) => b.currentStreak - a.currentStreak
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Top Section: Leaderboard & Streaks */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* All-Time Leaderboard */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Leaderboard</CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{p.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    {p.sessions.length} sessions
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Streaks */}
        <Card className="border-orange-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Streaks</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streaks.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{p.name}</span>
                    {p.currentStreak >= 3 && (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
                      </motion.span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-orange-500">
                      Current: {p.currentStreak}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Best: {p.longestStreak}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Recap Visualization */}
      <Card className="bg-card/50 backdrop-blur-sm border-muted p-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-bold">Monthly Recap</h3>
            <p className="text-sm text-muted-foreground">
              Total gym sessions per month.
            </p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#fb923c' }}
              />
              <Bar 
                dataKey="count" 
                fill="#fb923c" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
