import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Badge } from './ui/badge.tsx';
import { Progress } from './ui/progress.tsx';
import { Alert, AlertDescription } from './ui/alert.tsx';
import { ArrowLeft, Clock, Users, Trophy, Play, Pause, Square, RefreshCw } from 'lucide-react';
import { tournamentStore, Tournament, Match, TournamentParticipant } from '../data/store.ts';

type Page = 'login' | 'player-dashboard' | 'organizer-dashboard' | 'tournament-creation' | 'tournament-management' | 'ranking' | 'player-profile' | 'subscription';

interface TournamentManagementProps {
  onNavigate: (page: Page, data?: any) => void;
  tournamentId: string;
  currentUser: any;
}

export function TournamentManagement({ onNavigate, tournamentId, currentUser }: TournamentManagementProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<TournamentParticipant[]>([]);
  const [roundTimer, setRoundTimer] = useState(45 * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const loadTournamentData = () => {
      try {
        const tournamentData = tournamentStore.getTournamentById(tournamentId);
        if (!tournamentData) {
          throw new Error('Tournament not found');
        }

        setTournament(tournamentData);
        setMatches(tournamentData.matches || []);
        setStandings(tournamentData.participants || []);
        
        if (tournamentData.status === 'in-progress') {
          setTimerActive(true);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadTournamentData();
    
    const unsubscribe = tournamentStore.subscribe(loadTournamentData);
    return () => unsubscribe();
  }, [tournamentId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timerActive && roundTimer > 0 && tournament?.status === 'in-progress') {
      interval = setInterval(() => {
        setRoundTimer(prev => prev - 1);
      }, 1000);
    } else if (roundTimer === 0) {
      setTimerActive(false);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, roundTimer, tournament?.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const updateMatchResult = (matchId: string, player1Score: number, player2Score: number) => {
    if (!tournament) return;

    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        const winnerId = player1Score > player2Score ? match.player1Id : 
                        player2Score > player1Score ? match.player2Id : undefined;
        const winnerName = player1Score > player2Score ? match.player1Name : 
                          player2Score > player1Score ? match.player2Name : undefined;
        
        return {
          ...match,
          player1Score,
          player2Score,
          winnerId,
          winnerName,
          status: 'completed' as const
        };
      }
      return match;
    });

    const updatedTournament = {
      ...tournament,
      matches: updatedMatches
    };
    
    tournamentStore.updateTournamentMatches(tournamentId, updatedMatches);
    setMatches(updatedMatches);
    updateStandings(updatedTournament);
  };

  const updateStandings = (tournamentData: Tournament) => {
    const updatedParticipants = [...tournamentData.participants].map(participant => {
      const playerMatches = tournamentData.matches.filter(m => 
        m.player1Id === participant.userId || m.player2Id === participant.userId
      );
      
      let wins = 0;
      let losses = 0;
      let draws = 0;
      let points = 0;
      
      playerMatches.forEach(match => {
        if (match.status === 'completed') {
          if (match.winnerId === participant.userId) {
            wins++;
            points += 3;
          } else if (
            match.player1Id === participant.userId || 
            match.player2Id === participant.userId
          ) {
            losses++;
          }
          
          if (match.player1Score === match.player2Score) {
            draws++;
            points += 1;
          }
        }
      });
      
      return {
        ...participant,
        wins,
        losses,
        draws,
        points
      };
    });
    
    updatedParticipants.sort((a, b) => b.points - a.points);
    
    const rankedParticipants = updatedParticipants.map((p, index) => ({
      ...p,
      currentStanding: index + 1
    }));
    
    setStandings(rankedParticipants);
    
    const updatedTournament = {
      ...tournamentData,
      participants: rankedParticipants
    };
    
    tournamentStore.updateTournamentParticipants(tournamentId, rankedParticipants);
  };

  const startNextRound = () => {
    if (!tournament) return;
    
    if (tournament.currentRound < tournament.rounds) {
      const nextRound = tournament.currentRound + 1;
      const newMatches = generateMatchesForNextRound(tournament, nextRound);
      
      const updatedTournament = {
        ...tournament,
        currentRound: nextRound,
        matches: [...matches, ...newMatches],
        status: 'in-progress'
      };
      
      tournamentStore.updateTournament(updatedTournament);
      setTournament(updatedTournament);
      setMatches(prev => [...prev, ...newMatches]);
      setRoundTimer(45 * 60);
      setTimerActive(true);
    }
  };

  const generateMatchesForNextRound = (tournament: Tournament, round: number): Match[] => {
    const participants = [...tournament.participants];
    const newMatches: Match[] = [];
    
    const half = Math.ceil(participants.length / 2);
    for (let i = 0; i < half; i++) {
      const player1 = participants[i];
      const player2 = participants[i + half] || participants[0];
      
      if (player1 && player2) {
        newMatches.push({
          id: `match-${Date.now()}-${i}`,
          tournamentId: tournament.id,
          round,
          table: i + 1,
          player1Id: player1.userId,
          player1Name: player1.userName,
          player2Id: player2.userId,
          player2Name: player2.userName,
          player1Score: 0,
          player2Score: 0,
          status: 'pending'
        });
      }
    }
    
    return newMatches;
  };

  const endTournament = () => {
    if (!tournament) return;
    
    const updatedTournament = {
      ...tournament,
      status: 'completed',
      currentRound: tournament.rounds
    };
    
    tournamentStore.updateTournamentStatus(tournament.id, 'completed');
    setTournament(updatedTournament);
    setShowEndDialog(false);
    setTimerActive(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tournament data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => onNavigate('organizer-dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </Alert>
    );
  }

  if (!tournament) {
    return <div className="flex justify-center items-center h-64">Tournament not found</div>;
  }

  const completedMatches = matches.filter(match => 
    match.status === 'completed' && match.round === tournament.currentRound
  ).length;
  
  const currentRoundMatches = matches.filter(match => 
    match.round === tournament.currentRound
  ).length;
  
  const roundProgress = currentRoundMatches > 0 
    ? (completedMatches / currentRoundMatches) * 100 
    : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('organizer-dashboard')}
          className="mb-4 px-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            <p className="text-muted-foreground text-sm">
              Tournament Management - Round {tournament.currentRound} of {tournament.rounds}
            </p>
          </div>
          
          {tournament.status === 'in-progress' && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold">{formatTime(roundTimer)}</div>
                <div className="flex justify-center gap-2 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTimerActive(!timerActive)}
                    className="h-8 w-8 p-0"
                  >
                    {timerActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRoundTimer(45 * 60)}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold">Tournament Status</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={tournament.status === 'completed' ? 'default' : 'secondary'}>
                {tournament.status === 'completed' ? 'Completed' : 
                 `Round ${tournament.currentRound} of ${tournament.rounds}`}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(tournament.date)} • {tournament.time}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{tournament.participants.length}</span>
              <span className="text-sm text-muted-foreground">
                {tournament.maxParticipants ? `/ ${tournament.maxParticipants}` : 'players'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">{completedMatches}/{currentRoundMatches}</span>
              <span className="text-sm text-muted-foreground">matches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match Results Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Match Results - Round {tournament.currentRound}</CardTitle>
          <CardDescription>Enter match results as they complete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {matches
            .filter(match => match.round === tournament.currentRound)
            .sort((a, b) => a.table - b.table)
            .map((match) => (
              <div key={match.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Table {match.table}</span>
                  <Badge variant={match.status === 'completed' ? 'default' : 'outline'}>
                    {match.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-5 items-center gap-4">
                  <span className="text-right font-medium truncate">{match.player1Name}</span>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      value={match.player1Score}
                      onChange={(e) => updateMatchResult(
                        match.id, 
                        parseInt(e.target.value) || 0, 
                        match.player2Score
                      )}
                      className="w-12 text-center"
                      disabled={match.status === 'completed'}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      value={match.player2Score}
                      onChange={(e) => updateMatchResult(
                        match.id, 
                        match.player1Score, 
                        parseInt(e.target.value) || 0
                      )}
                      className="w-12 text-center"
                      disabled={match.status === 'completed'}
                    />
                  </div>
                  
                  <span className="font-medium truncate">{match.player2Name}</span>
                </div>

                {match.winnerId && (
                  <div className="mt-3 text-center">
                    <Badge variant="default" className="inline-flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      Winner: {match.winnerName}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Participants</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournament.participants.length}</div>
            <div className="text-sm text-muted-foreground">
              {tournament.maxParticipants ? `${tournament.participants.length}/${tournament.maxParticipants}` : 'Total players'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Round Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMatches}/{currentRoundMatches}</div>
            <Progress value={roundProgress} className="mt-2" />
            <div className="text-sm text-muted-foreground mt-1">
              {Math.round(roundProgress)}% complete
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {standings.slice(0, 3).map((player) => (
                <div key={player.id} className="flex justify-between items-center">
                  <span className="font-medium truncate">{player.userName}</span>
                  <Badge variant="outline">
                    {player.wins}-{player.losses}-{player.draws}
                  </Badge>
                </div>
              ))}
              {standings.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{standings.length - 3} more players
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Standings Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Standings</CardTitle>
          <CardDescription>Tournament rankings after current round</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {standings
              .sort((a, b) => a.currentStanding - b.currentStanding)
              .map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                      {player.currentStanding}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{player.userName}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {player.points} points
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {player.wins}-{player.losses}-{player.draws}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Tournament Controls */}
      {tournament.status === 'in-progress' && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold">Tournament Controls</h3>
              <p className="text-sm text-muted-foreground">
                Current: Round {tournament.currentRound} of {tournament.rounds} • 
                {completedMatches} of {currentRoundMatches} matches completed
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tournament.currentRound < tournament.rounds && (
                <Button
                  onClick={startNextRound}
                  disabled={completedMatches < currentRoundMatches}
                  size="sm"
                  className="flex-1 md:flex-none"
                >
                  Start Round {tournament.currentRound + 1}
                </Button>
              )}
              
              <Button
                variant="destructive"
                onClick={() => setShowEndDialog(true)}
                size="sm"
                className="flex-1 md:flex-none"
              >
                End Tournament
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* End Tournament Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>End Tournament</CardTitle>
              <CardDescription>
                Are you sure you want to end this tournament? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowEndDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={endTournament}>
                  End Tournament
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}