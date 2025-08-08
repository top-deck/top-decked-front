import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import { Calendar, Users, Trophy, Plus, Upload, Settings, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { tournamentStore } from '../data/store.ts';

type Page = 'login' | 'player-dashboard' | 'organizer-dashboard' | 'tournament-creation' | 'subscription' | 'tournament-details';

interface OrganizerDashboardProps {
  onNavigate: (page: Page, data?: any) => void;
  currentUser: any;
}

export function OrganizerDashboard({ onNavigate, currentUser }: OrganizerDashboardProps) {
  const [tournaments, setTournaments] = useState(tournamentStore.getTournamentsByOrganizer(currentUser?.id || ''));
  const [stats, setStats] = useState({
    activeTournaments: 0,
    totalParticipants: 0,
    completedEvents: 0,
    averageAttendance: 0
  });

  const [monthlyData, setMonthlyData] = useState<{month: string, tournaments: number, participants: number}[]>([]);
  const [formatData, setFormatData] = useState<{name: string, value: number, color: string}[]>([]);

  const loadData = useCallback(() => {
    if (!currentUser || currentUser.type !== 'organizer') return;

    const organizerTournaments = tournamentStore.getTournamentsByOrganizer(currentUser.id);
    setTournaments(organizerTournaments);

    // Calcula estatísticas
    const activeTournaments = organizerTournaments.filter(t => 
      t.status === 'registration' || t.status === 'in-progress'
    ).length;

    const completedEvents = organizerTournaments.filter(t => 
      t.status === 'completed'
    ).length;

    const totalParticipants = organizerTournaments.reduce(
      (sum, t) => sum + t.participants.length, 0
    );

    const averageAttendance = completedEvents > 0
      ? Math.round(
          organizerTournaments
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + t.participants.length, 0) /
          completedEvents
        )
      : 0;

    setStats({
      activeTournaments,
      totalParticipants,
      completedEvents,
      averageAttendance
    });

    // Prepara dados para gráficos
    prepareChartData(organizerTournaments);
  }, [currentUser]);

  const prepareChartData = (tournaments: typeof tournamentStore.getAllTournaments extends () => infer T ? T : never) => {
    // Dados mensais (simplificado - agrupa por mês de criação)
    const monthlyStats: Record<string, {tournaments: number, participants: number}> = {};
    
    tournaments.forEach(t => {
      const month = new Date(t.createdAt).toLocaleString('default', { month: 'short' });
      if (!monthlyStats[month]) {
        monthlyStats[month] = { tournaments: 0, participants: 0 };
      }
      monthlyStats[month].tournaments += 1;
      monthlyStats[month].participants += t.participants.length;
    });

    const monthly = Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      tournaments: data.tournaments,
      participants: data.participants
    })).slice(-6); // Últimos 6 meses

    setMonthlyData(monthly);

    // Distribuição de formatos
    const formatCounts: Record<string, number> = {};
    tournaments.forEach(t => {
      formatCounts[t.format] = (formatCounts[t.format] || 0) + 1;
    });

    const colors = ['#2d1b69', '#6366f1', '#8b5cf6', '#ffd700', '#06b6d4'];
    const formats = Object.entries(formatCounts).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));

    setFormatData(formats);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = tournamentStore.subscribe(loadData);
    return () => unsubscribe();
  }, [loadData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'outline';
      case 'registration': return 'secondary';
      case 'in-progress': return 'default';
      case 'completed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Agendado';
      case 'registration': return 'Inscrições Abertas';
      case 'in-progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const upcomingTournaments = tournaments.filter(t => 
    t.status === 'upcoming' || t.status === 'registration'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentTournaments = tournaments
    .filter(t => t.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const getMetricName = (name: string) => {
    switch (name) {
      case 'tournaments': return 'Torneios';
      case 'participants': return 'Participantes';
      default: return name;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel do Organizador</h1>
        <p className="text-muted-foreground">Bem-vindo(a) de volta, {currentUser?.name}! Gerencie seus torneios.</p>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button onClick={() => onNavigate('tournament-creation')} className="h-16 flex items-center space-x-3">
          <Plus className="h-5 w-5" />
          <span>Criar Novo Torneio</span>
        </Button>

        <Button variant="outline" className="h-16 flex items-center space-x-3">
          <Upload className="h-5 w-5" />
          <span>Importar Dados</span>
        </Button>

        <Button variant="outline" onClick={() => onNavigate('subscription')} className="h-16 flex items-center space-x-3">
          <Settings className="h-5 w-5" />
          <span>Gerenciar Assinatura</span>
        </Button>
      </div>

      {/* Cartões de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Torneios Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTournaments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Concluídos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Presença</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Mensal</CardTitle>
            <CardDescription>Torneios criados e participantes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, getMetricName(name)]} />
                <Legend formatter={getMetricName} />
                <Bar dataKey="tournaments" fill="#2d1b69" />
                <Bar dataKey="participants" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formatos de Torneio</CardTitle>
            <CardDescription>Distribuição por formato</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {formatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Torneios */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Próximos Torneios</CardTitle>
          <CardDescription>Seus eventos agendados</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingTournaments.length > 0 ? (
            <div className="space-y-4">
              {upcomingTournaments.map(tournament => (
                <div key={tournament.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tournament.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tournament.date).toLocaleDateString()} às {tournament.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {tournament.participants.length}/{tournament.maxParticipants}
                        </span>
                      </div>
                      <Badge variant={getStatusColor(tournament.status)}>
                        {getStatusText(tournament.status)}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('tournament-details', { tournamentId: tournament.id })}
                    >
                      Gerenciar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum torneio agendado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Torneios Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Torneios Recentes</CardTitle>
          <CardDescription>Seus últimos eventos concluídos</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTournaments.length > 0 ? (
            <div className="space-y-4">
              {recentTournaments.map(tournament => {
                const winner = tournament.matches.find(m => m.winnerId)?.winnerName || 'N/D';
                return (
                  <div key={tournament.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Trophy className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tournament.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tournament.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{tournament.participants.length} jogadores</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Vencedor: {winner}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum torneio recente
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}