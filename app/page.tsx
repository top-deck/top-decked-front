'use client';

import { useState } from 'react';
import { Trophy, Eye, EyeOff, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AccountType = 'Player' | 'Organizer';

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [dob, setDob] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('Player');
  const [store, setStore] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'player@example.com' && loginPassword === 'player123') {
      alert('Logged in as Player!');
      router.push('/dashboard/player');
    } else if (loginEmail === 'organizer@example.com' && loginPassword === 'organizer123') {
      alert('Logged in as Organizer!');
      router.push('/dashboard/organizer');
    } else {
      alert('Invalid login credentials');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Registered ${name} as ${accountType}`);
    setMode('login');
  };

  // New helper for demo login buttons
  const handleDemoLogin = (email: string, password: string, account: AccountType) => {
    setLoginEmail(email);
    setLoginPassword(password);
    setMode('login');
    alert(`Logged in as ${account}!`);
    router.push(account === 'Player' ? '/dashboard/player' : '/dashboard/organizer');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f1fb] px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Trophy className="h-10 w-10 text-purple-700 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-purple-800">Welcome to TopDecked</h1>
          <p className="text-sm text-gray-600">The ultimate platform for TCG tournament management</p>
        </div>

        {/* Demo Accounts Box */}
        <div className="bg-white border border-yellow-300 p-4 rounded-lg shadow-sm relative">
          <h2 className="text-sm font-semibold text-gray-700">Demo Accounts</h2>
          <p className="text-xs text-gray-500 mb-3">Try the platform with pre-configured accounts</p>

          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <div>
                <p className="font-medium text-sm text-black">
                  Alex Chen <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Player</span>
                </p>
                <p className="text-xs text-gray-500">Tournament player with rankings</p>
              </div>
              <button
                onClick={() => handleDemoLogin('player@example.com', 'player123', 'Player')}
                className="text-sm bg-purple-800 text-white px-4 py-1 rounded hover:bg-purple-900"
              >
                Login
              </button>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <div>
                <p className="font-medium text-sm text-black">
                  Sarah Johnson{' '}
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Organizer</span>
                </p>
                <p className="text-xs text-gray-500">Tournament organizer at Game Central</p>
              </div>
              <button
                onClick={() => handleDemoLogin('organizer@example.com', 'organizer123', 'Organizer')}
                className="text-sm bg-purple-800 text-white px-4 py-1 rounded hover:bg-purple-900"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-md shadow-sm text-center text-sm">
            <User className="mx-auto mb-1 text-purple-700" />
            <p className="font-medium text-black">For Players</p>
            <p className="text-gray-500 text-xs">Track your progress and rankings</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm text-center text-sm">
            <Calendar className="mx-auto mb-1 text-purple-700" />
            <p className="font-medium text-black">For Organizers</p>
            <p className="text-gray-500 text-xs">Manage tournaments with ease</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white rounded-full overflow-hidden border">
          <button
            className={`w-1/2 py-2 text-sm font-medium transition ${
              mode === 'login'
                ? 'bg-purple-100 text-purple-800'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-sm font-medium transition ${
              mode === 'register'
                ? 'bg-purple-100 text-purple-800'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {/* Form Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">Login</h3>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-xs text-gray-600 mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-[34px] text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-800 text-white py-2 rounded hover:bg-purple-900 transition-colors"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-sm">
              <h3 className="font-semibold text-gray-800">Register</h3>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Account Type</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                >
                  <option value="Player">Player</option>
                  <option value="Organizer">Organizer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Store/Location (optional)</label>
                <input
                  type="text"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-800 text-white py-2 rounded hover:bg-purple-900 transition-colors"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
