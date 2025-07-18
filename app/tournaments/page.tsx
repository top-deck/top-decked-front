'use client';

import React, { useState } from 'react';
import { Search, Filter, Calendar, Swords, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

// Sample tournament data
const tournaments = [
  {
    id: 1,
    name: 'Weekly Modern Championship',
    organizer: 'Sarah Johnson',
    date: '2024-12-24',
    format: 'Modern',
    description: 'Weekly modern tournament with great prizes!',
    entryFee: '$15',
    status: 'registered',
    registered: 24,
    capacity: 32,
    location: 'Game Central'
  },
  {
    id: 2,
    name: 'Standard Showdown',
    organizer: 'Sarah Johnson',
    date: '2024-12-21',
    format: 'Standard',
    description: 'Competitive standard format tournament',
    entryFee: '$10',
    status: 'upcoming',
    registered: 0,
    capacity: 24,
    location: 'Game Central'
  },
  {
    id: 3,
    name: 'Friday Night Magic',
    organizer: 'Sarah Johnson',
    date: '2024-12-14',
    format: 'Modern',
    description: 'Casual Friday night tournament',
    entryFee: '$5',
    status: 'available',
    registered: 3,
    capacity: 16,
    location: 'Game Central'
  }
];

const statusOptions = ['All Statuses', 'Available', 'Upcoming', 'Registered', 'Completed'];
const formatOptions = ['All Formats', 'Modern', 'Standard', 'Pioneer', 'Commander', 'Draft'];

export default function TournamentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [expandedTournament, setExpandedTournament] = useState<number | null>(null);

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tournament.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All Statuses' || 
                         tournament.status.includes(selectedStatus.toLowerCase());
    const matchesFormat = selectedFormat === 'All Formats' || 
                         tournament.format === selectedFormat;
    
    return matchesSearch && matchesStatus && matchesFormat;
  });

  const toggleTournamentExpand = (id: number) => {
    setExpandedTournament(expandedTournament === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
        <p className="text-gray-600">Discover and join tournaments</p>
      </div>

      {/* Filters Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tournaments..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Format Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              {formatOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Tournaments</h2>
        
        {filteredTournaments.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No tournaments found matching your criteria</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTournaments.map(tournament => (
              <Card key={tournament.id} className="overflow-hidden">
                <div 
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleTournamentExpand(tournament.id)}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{tournament.name}</h3>
                    <p className="text-sm text-gray-500">Organized by {tournament.organizer}</p>
                  </div>
                  {expandedTournament === tournament.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {expandedTournament === tournament.id && (
                  <div className="border-t p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{tournament.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Swords className="h-4 w-4 text-gray-400" />
                        <span>{tournament.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{tournament.registered}/{tournament.capacity} players</span>
                      </div>
                    </div>

                    <p className="mb-4">{tournament.description}</p>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="font-medium">Entry: {tournament.entryFee}</p>
                        <p className="text-sm text-gray-500">{tournament.location}</p>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        {tournament.status === 'registered' && (
                          <Button variant="outline" className="w-full sm:w-auto">
                            Registered
                          </Button>
                        )}
                        {tournament.status === 'upcoming' && (
                          <Button variant="outline" className="w-full sm:w-auto">
                            Upcoming
                          </Button>
                        )}
                        {tournament.status === 'available' && (
                          <Button className="w-full sm:w-auto">
                            Register Now
                          </Button>
                        )}
                        <Button variant="default" className="w-full sm:w-auto">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}