import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import { Avatar, AvatarFallback } from './ui/avatar.tsx';
import { Alert, AlertDescription } from './ui/alert.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.tsx';
import { ArrowLeft, Calendar, Users, Trophy, MapPin, DollarSign, Clock, CheckCircle, UserPlus, UserMinus, Crown } from 'lucide-react';
import { tournamentStore, Tournament, User, BracketMatch } from '../data/store.ts';

type Page = 'login' | 'player-dashboard' | 'organizer-dashboard' | 'tournament-creation' | 'tournament-management' | 'ranking' | 'player-profile' | 'subscription' | 'tournament-details' | 'tournament-list';

interface TournamentDetailsProps {
  onNavigate: (page: Page, data?: any) => void;
  tournamentId: string | null;
  currentUser: User | null;
}

export function TournamentDetails({ onNavigate, tournamentId, currentUser }: TournamentDetailsProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<'loading' | 'registered' | 'not-registered' | 'full'>('loading');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (tournamentId) {
      const foundTournament = tournamentStore.getTournamentById(tournamentId);
      setTournament(foundTournament || null);
      
      if (foundTournament && currentUser?.type === 'jogador') {
        const isRegistered = foundTournament.participants.some(p => p.userId === currentUser.id);
        const isFull = foundTournament.participants.length >= foundTournament.maxParticipants;
        
        if (isRegistered) {
          setRegistrationStatus('registered');
        } else if (isFull) {
          setRegistrationStatus('full');
        } else {
          setRegistrationStatus('not-registered');
        }
      }
    }
  }, [tournamentId, currentUser]);

  const handleRegistration = () => {
    if (!tournament || !currentUser || currentUser.type !== 'jogador') return;

    const success = tournamentStore.registerPlayerForTournament(tournament.id, currentUser.id);
    
    if (success) {
      setMessage({ type: 'success', text: 'Successfully registered for tournament!' });
      setRegistrationStatus('registered');
      // Refresh tournament data
      const updatedTournament = tournamentStore.getTournamentById(tournament.id);
      setTournament(updatedTournament || null);
    } else {
      setMessage({ type: 'error', text: 'Failed to register. Tournament may be full.' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUnregistration = () => {
    if (!tournament || !currentUser || currentUser.type !== 'jogador') return;

    const success = tournamentStore.unregisterPlayerFromTournament(tournament.id, currentUser.id);
    
    if (success) {
      setMessage({ type: 'success', text: 'Successfully unregistered from tournament.' });
      setRegistrationStatus('not-registered');

      const updatedTournament = tournamentStore.getTournamentById(tournament.id);
      setTournament(updatedTournament || null);
    } else {
      setMessage({ type: 'error', text: 'Failed to unregister.' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'aberto': return 'secondary';
      case 'em progresso': return 'default';
      case 'completado': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: Tournament['status']) => {
    switch (status) {
      case 'aberto': return 'Aberto';
      case 'em progresso': return 'Em progresso';
      case 'completado': return 'Completado';
      default: return 'Unknown';
    }
  };

  const renderBracket = () => {
    if (!tournament?.bracket || tournament.bracket.length === 0) {
      return (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Bracket will be available once the tournament starts</p>
        </div>
      );
    }


    const rounds = tournament.bracket.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, BracketMatch[]>);

    return (
      <div className="space-y-8">
        {Object.entries(rounds).map(([roundNum, matches]) => (
          <div key={roundNum}>
            <h3 className="font-semibold mb-4">Round {roundNum}</h3>
            <div className="grid gap-4">
              {(matches as BracketMatch[]).map((match) => (
                <Card key={match.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${match.winner?.id === match.player1?.id ? 'text-primary' : ''}`}>
                          {match.player1?.name || 'TBD'}
                        </span>
                        {match.winner?.id === match.player1?.id && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground">vs</div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${match.winner?.id === match.player2?.id ? 'text-primary' : ''}`}>
                          {match.player2?.name || 'TBD'}
                        </span>
                        {match.winner?.id === match.player2?.id && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>
                    {match.score && (
                      <Badge variant="outline">{match.score}</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
          <Button onClick={() => onNavigate('tournament-list')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  const canManage = currentUser?.type === 'organizador' && currentUser.id === tournament.organizerId;
  const canRegister = currentUser?.type === 'jogador' && registrationStatus === 'not-registered' && tournament.status === 'registration';
  const canUnregister = currentUser?.type === 'jogador' && registrationStatus === 'registered' && tournament.status === 'registration';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate(currentUser?.type === 'jogador' ? 'player-dashboard' : 'organizer-dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Tournament Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <Badge variant={getStatusColor(tournament.status)}>
                  {getStatusText(tournament.status)}
                </Badge>
              </div>
              <p className="text-muted-foreground">Organizado por {tournament.organizerName}</p>
            </div>
            <div className="flex space-x-2">
              {canRegister && (
                <Button onClick={handleRegistration} className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Button>
              )}
              {canUnregister && (
                <Button variant="outline" onClick={handleUnregistration} className="flex items-center space-x-2">
                  <UserMinus className="h-4 w-4" />
                  <span>Unregister</span>
                </Button>
              )}
              {canManage && (
                <Button 
                  onClick={() => onNavigate('tournament-management', { tournamentId: tournament.id })}
                  className="flex items-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Manage</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{new Date(tournament.date).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">{tournament.time}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{tournament.store}</div>
                <div className="text-sm text-muted-foreground">{tournament.format}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{tournament.participants.length}/{tournament.maxParticipants}</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{tournament.entryFee}</div>
                <div className="text-sm text-muted-foreground">Entry Fee</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
          <AlertDescription className="flex items-center space-x-2">
            {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
            <span>{message.text}</span>
          </AlertDescription>
        </Alert>
      )}

      {registrationStatus === 'registered' && currentUser?.type === 'jogador' && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            You are registered for this tournament!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{tournament.description || 'No description provided.'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prize Structure</h4>
                <p className="text-muted-foreground">{tournament.prizes || 'Prizes TBD'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Format Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Format: <span className="font-medium">{tournament.format}</span></div>
                    <div>Structure: <span className="font-medium">{tournament.structure}</span></div>
                    <div>Rounds: <span className="font-medium">{tournament.rounds}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Current Status</h4>
                  <div className="space-y-1 text-sm">
                    <div>Round: <span className="font-medium">{tournament.currentRound}/{tournament.rounds}</span></div>
                    <div>Status: <span className="font-medium">{getStatusText(tournament.status)}</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Participants ({tournament.participants.length})</CardTitle>
              <CardDescription>
                {tournament.maxParticipants - tournament.participants.length} spots remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tournament.participants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No participants registered yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.participants.map((participant) => (
                    <Card key={participant.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {participant.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{participant.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              Registered {new Date(participant.registeredAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bracket" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Bracket</CardTitle>
              <CardDescription>
                {tournament.status === 'completed' ? 'Final results' : 'Live bracket updates'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBracket()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Standings</CardTitle>
              <CardDescription>Tournament leaderboard</CardDescription>
            </CardHeader>
            <CardContent>
              {tournament.participants.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Standings will appear once the tournament begins</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tournament.participants
                    .sort((a, b) => b.points - a.points || b.wins - a.wins)
                    .map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {participant.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {participant.wins}-{participant.losses}-{participant.draws}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{participant.points}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}