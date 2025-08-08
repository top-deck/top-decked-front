'use client';

import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

import { Trophy, Target, Calendar, Medal, Users, TrendingUp } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
} from '@/components/ui';

// Your data
const radarData = [
  { subject: 'Aggro', A: 120, fullMark: 150 },
  { subject: 'Control', A: 98, fullMark: 150 },
  { subject: 'Combo', A: 86, fullMark: 150 },
  { subject: 'Midrange', A: 99, fullMark: 150 },
  { subject: 'Tempo', A: 85, fullMark: 150 },
  { subject: 'Ramp', A: 65, fullMark: 150 },
];

const performanceData = [
  { month: 'Jan', points: 1200 },
  { month: 'Feb', points: 1350 },
  { month: 'Mar', points: 1280 },
  { month: 'Apr', points: 1450 },
  { month: 'May', points: 1520 },
  { month: 'Jun', points: 1680 },
];

const recentTournaments = [
  { id: 1, name: 'Weekly Modern', date: '2024-12-15', placement: 2, participants: 32, points: 180 },
  { id: 2, name: 'Standard Showdown', date: '2024-12-10', placement: 5, participants: 24, points: 120 },
  { id: 3, name: 'Friday Night Magic', date: '2024-12-08', placement: 1, participants: 16, points: 200 },
  { id: 4, name: 'Commander Night', date: '2024-12-05', placement: 3, participants: 12, points: 100 },
];

export default function PlayerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Player Dashboard</h1>
        <p className="text-gray-600">Welcome back, Alex! Here's your tournament progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,680</div>
            <p className="text-xs text-gray-500">+160 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">This season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Medal className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#12</div>
            <p className="text-xs text-gray-500">Regional ranking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Deck Archetype Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Deck Archetype Performance</CardTitle>
            <CardDescription>Your performance across different deck types</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 150]} />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="#2d1b69"
                  fill="#2d1b69"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Point Progression Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Point Progression</CardTitle>
            <CardDescription>Your ranking points over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#2d1b69"
                  strokeWidth={2}
                  dot={{ fill: '#2d1b69' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tournaments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Tournaments</CardTitle>
          <CardDescription>Your latest tournament results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTournaments.map((tournament) => (
              <div key={tournament.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{tournament.name}</h3>
                    <p className="text-sm text-gray-500">{tournament.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{tournament.participants}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">+{tournament.points} pts</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      tournament.placement === 1
                        ? 'default'
                        : tournament.placement <= 3
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    #{tournament.placement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rankings Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Rankings</CardTitle>
          <CardDescription>Your position in various leaderboards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Monthly</h3>
              <p className="text-3xl font-bold text-purple-700">#8</p>
              <p className="text-sm text-gray-500">1,680 points</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Yearly</h3>
              <p className="text-3xl font-bold text-purple-700">#12</p>
              <p className="text-sm text-gray-500">15,240 points</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">Overall</h3>
              <p className="text-3xl font-bold text-purple-700">#23</p>
              <p className="text-sm text-gray-500">28,950 points</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => alert('Navigate to full rankings')}>
              <Trophy className="h-4 w-4 inline-block mr-1" />
              View Full Rankings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
