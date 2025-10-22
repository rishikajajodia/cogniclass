import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();

  // Demo accounts for instant testing
  const demoAccounts = [
    { email: 'professor@university.edu', password: 'demo', role: 'Teacher 👨‍🏫', name: 'Dr. Smith' },
    { email: 'alex@student.edu', password: 'demo', role: 'Student 🎓', name: 'Alex Johnson' },
    { email: 'sarah@student.edu', password: 'demo', role: 'Student 🎓', name: 'Sarah Chen' },
    { email: 'mike@student.edu', password: 'demo', role: 'Student 🎓', name: 'Mike Rodriguez' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, demoName: string) => {
    try {
      // Try login first
      await login(demoEmail, demoPassword);
    } catch (error) {
      // If login fails, register the demo account
      try {
        await register(demoEmail, demoPassword, demoName);
        await login(demoEmail, demoPassword);
      } catch (registerError) {
        alert('Demo setup failed. Please load demo data first.');
      }
    }
  };

  const loadDemoData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/demo/setup', { 
        method: 'POST' 
      });
      if (response.ok) {
        alert('Demo data loaded successfully! You can now use demo accounts.');
      }
    } catch (error) {
      alert('Demo data endpoint not available. Using basic accounts only.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to CogniClass' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            AI-powered collaborative learning platform
          </p>
        </div>

        {/* Demo Accounts Section */}
        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-3">🎓 Quick Demo Access</h3>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email, account.password, account.name)}
                  className="w-full text-left p-2 bg-white rounded border hover:shadow-sm transition-shadow text-sm"
                >
                  <div className="font-medium text-gray-900">{account.name}</div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{account.role}</span>
                    <span className="text-blue-600">Click to login →</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={loadDemoData}
              className="w-full mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              First time? Load demo groups & chat data
            </button>
          </div>
        )}

        {/* Regular Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <input
                id="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </button>
          </div>
        </form>

        {/* Demo Instructions */}
        <div className="text-center text-xs text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg">
          <strong>Demo Instructions:</strong>
          <ol className="mt-2 space-y-1 text-left">
            <li>1. Click "Load demo data" (first time only)</li>
            <li>2. Click any demo account to login instantly</li>
            <li>3. Explore AI Tutor, Groups, and Chat!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}