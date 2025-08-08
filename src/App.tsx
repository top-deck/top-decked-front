import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { PlayerDashboard } from './components/PlayerDashboard.tsx';
import { OrganizerDashboard } from './components/OrganizerDashboard.tsx';
import { tournamentStore, User } from './data/store.ts';

type Page = 'login' | 'player-dashboard' | 'organizer-dashboard' | 'tournament-creation' | 'tournament-management' | 'ranking' | 'player-profile' | 'subscription' | 'tournament-details' | 'tournament-list';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    tournamentStore.setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentPage(user.type === 'player' ? 'player-dashboard' : 'organizer-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    tournamentStore.setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('login');
    setSelectedTournamentId(null);
  };

  const handleNavigateToTournament = (tournamentId: string) => {
    setSelectedTournamentId(tournamentId);
    setCurrentPage('tournament-details');
  };

  const handleNavigate = (page: Page, data?: any) => {
    if (page === 'tournament-details' && data?.tournamentId) {
      setSelectedTournamentId(data.tournamentId);
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'player-dashboard':
        return (
          <PlayerDashboard 
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        );
      case 'organizer-dashboard':
        return (
          <OrganizerDashboard 
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && (
        <Header 
          userType={currentUser?.type || null} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          currentPage={currentPage}
          currentUser={currentUser}
        />
      )}
      <main className={isAuthenticated ? 'pt-16' : ''}>
        {renderPage()}
      </main>
    </div>
  );
}