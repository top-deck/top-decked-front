'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { PlusCircle, Swords, Users, CalendarCheck, Trophy, Settings } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';

// Sample data
const monthlyActivityData = [
  { name: 'Jan', tournaments: 12, participants: 320 },
  { name: 'Feb', tournaments: 15, participants: 450 },
  { name: 'Mar', tournaments: 18, participants: 520 },
  { name: 'Apr', tournaments: 14, participants: 410 },
  { name: 'May', tournaments: 20, participants: 580 },
  { name: 'Jun', tournaments: 22, participants: 680 },
];

const formatDistributionData = [
  { name: 'Modern', value: 35 },
  { name: 'Standard', value: 25 },
  { name: 'Draft', value: 5 },
  { name: 'Legacy', value: 15 },
  { name: 'Commander', value: 20 },
];

const upcomingTournaments = [
  { name: 'Weekly Modern', date: '2024-12-20', registered: 20, capacity: 32, status: 'Open' },
  { name: 'Standard Showdown', date: '2024-12-22', registered: 24, capacity: 24, status: 'Full' },
  { name: 'Commander Night', date: '2024-12-25', registered: 12, capacity: 16, status: 'Open' },
];

export default function OrganizerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organizer Dashboard</h1>
        <p className="text-gray-600">Welcome back! Manage your tournaments and track performance.</p>
      </div>

      {/* Create Tournament Button */}
      <div className="mb-8">
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Tournament
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
            <Swords className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">2 hits this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-gray-500">from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
            <CalendarCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Participants</CardTitle>
            <Trophy className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31</div>
            <p className="text-xs text-gray-500">players per event</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Tournament Activity</CardTitle>
            <CardDescription>Tournaments and participants over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="tournaments" fill="#8884d8" name="Tournaments" />
                <Bar yAxisId="right" dataKey="participants" fill="#82ca9d" name="Participants" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Format Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Format Distribution</CardTitle>
            <CardDescription>Popular tournament formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formatDistributionData.map((format) => (
                <div key={format.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium w-24">{format.name}</span>
                    <div className="w-full max-w-[200px] ml-4">
                      <div className="relative pt-1">
                        <div className="flex h-2 overflow-hidden text-xs bg-gray-200 rounded">
                          <div
                            style={{ width: `${format.value}%` }}
                            className={`flex flex-col justify-center ${
                              format.name === 'Modern' ? 'bg-purple-600' : 
                              format.name === 'Standard' ? 'bg-blue-500' :
                              format.name === 'Draft' ? 'bg-yellow-500' :
                              format.name === 'Legacy' ? 'bg-red-500' : 'bg-green-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="font-medium ml-4">{format.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tournaments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Tournaments</CardTitle>
          <CardDescription>Manage your scheduled events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTournaments.map((tournament, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{tournament.name}</h3>
                  <p className="text-sm text-gray-500">{tournament.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">
                      {tournament.registered}/{tournament.capacity} players
                    </p>
                    <p className={`text-xs ${
                      tournament.status === 'Open' ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {tournament.status}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}