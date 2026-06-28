import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        // Save the security token and user data to local storage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user_role', response.data.user.role);

        // Route them to the correct cinematic dashboard
        if (response.data.user.role === 'CEO') {
          navigate('/ceo');
        } else {
          navigate('/staff');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-800/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-white mb-2">
            Randaframes
          </h1>
          <p className="text-xs tracking-widest text-zinc-500 uppercase">Secure Access Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-500 transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Enter System'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;