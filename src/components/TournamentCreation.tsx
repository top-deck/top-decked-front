import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Textarea } from './ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import { Checkbox } from './ui/checkbox.tsx';
import { Alert, AlertDescription } from './ui/alert.tsx';
import { Calendar, Trophy, ArrowLeft, CheckCircle } from 'lucide-react';
import { tournamentStore, User } from '../data/store.ts';

type Page = 'login' | 'player-dashboard' | 'organizer-dashboard' | 'tournament-creation' | 'tournament-management' | 'ranking' | 'player-profile' | 'subscription' | 'tournament-details' | 'tournament-list';

interface TournamentCreationProps {
  onNavigate: (page: Page, data?: any) => void;
  currentUser: User | null;
}

export function TournamentCreation({ onNavigate, currentUser }: TournamentCreationProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    format: '',
    store: currentUser?.store || '',
    prizes: '',
    description: '',
    maxParticipants: '',
    entryFee: '',
    structure: '',
    rounds: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.name && formData.date && formData.format && formData.structure && currentUser) {
      try {
        const tournament = tournamentStore.createTournament({
          name: formData.name,
          organizerId: currentUser.id,
          organizerName: currentUser.name,
          date: formData.date,
          time: formData.time,
          format: formData.format,
          store: formData.store,
          description: formData.description,
          prizes: formData.prizes,
          maxParticipants: parseInt(formData.maxParticipants) || 32,
          entryFee: formData.entryFee,
          structure: formData.structure,
          rounds: parseInt(formData.rounds) || 5,
        });

        tournamentStore.updateTournamentStatus(tournament.id, 'registration');

        setMessage({ type: 'success', text: 'Tournament created successfully!' });
        setTimeout(() => {
          onNavigate('tournament-details', { tournamentId: tournament.id });
        }, 1500);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to create tournament. Please try again.' });
      }
    } else {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
    }
    
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      format: '',
      store: currentUser?.store || '',
      prizes: '',
      description: '',
      maxParticipants: '',
      entryFee: '',
      structure: '',
      rounds: '',
    });
    setMessage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('organizer-dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Create Tournament</h1>
        <p className="text-muted-foreground">Set up a new tournament event</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>Enter the basic details for your tournament</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name *</Label>
                <Input
                  id="name"
                  placeholder="Friday Night Magic"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format *</Label>
                <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Commander">Commander</SelectItem>
                    <SelectItem value="Legacy">Legacy</SelectItem>
                    <SelectItem value="Vintage">Vintage</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Sealed">Sealed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="32"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store">Store/Location</Label>
                <Input
                  id="store"
                  placeholder="Game Store Name"
                  value={formData.store}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entryFee">Entry Fee</Label>
                <Input
                  id="entryFee"
                  placeholder="$15"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tournament description, rules, or additional information..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prizes">Prizes</Label>
              <Textarea
                id="prizes"
                placeholder="1st Place: $100 store credit, 2nd Place: $50 store credit..."
                value={formData.prizes}
                onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tournament Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Tournament Structure</span>
            </CardTitle>
            <CardDescription>Configure the tournament format and rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="structure">Tournament Structure *</Label>
                <Select value={formData.structure} onValueChange={(value) => setFormData({ ...formData, structure: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Swiss">Swiss</SelectItem>
                    <SelectItem value="Single Elimination">Single Elimination</SelectItem>
                    <SelectItem value="Double Elimination">Double Elimination</SelectItem>
                    <SelectItem value="Round Robin">Round Robin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rounds">Number of Rounds</Label>
                <Input
                  id="rounds"
                  type="number"
                  placeholder="5"
                  value={formData.rounds}
                  onChange={(e) => setFormData({ ...formData, rounds: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription className="flex items-center space-x-2">
              {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
              <span>{message.text}</span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate('organizer-dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Tournament...' : 'Create Tournament'}
          </Button>
        </div>
      </form>
    </div>
  );
}