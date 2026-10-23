import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Wheat, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Direct integration or mock-backed authentication
      // Check admin shortcut or normal user
      const isAdmin = email.toLowerCase().includes('admin');
      
      const userPayload = {
        id: "u1-" + Date.now(),
        email: email,
        name: name || (isAdmin ? "Admin Manager" : email.split('@')[0]),
        role: isAdmin ? ('admin' as const) : ('customer' as const),
        points_balance: isRegister ? 50 : (isAdmin ? 0 : 120), // 50 welcome points on signup
        created_at: new Date().toISOString()
      };

      setToken("mock-jwt-token-" + Date.now());
      setUser(userPayload);

      if (userPayload.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#1F3A18] flex items-center justify-center text-cream mx-auto shadow-md">
          <Wheat className="w-6 h-6 text-[#F1E4A6]" />
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1F3A18]">
          {isRegister ? "Join the Baker's Club" : "Welcome Back"}
        </h1>
        <p className="font-poppins text-xs sm:text-sm text-[#333333]">
          {isRegister 
            ? "Create an account to earn 50 welcome loyalty points instantly."
            : "Sign in to track orders, redeem loyalty points, and manage favorites."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#1F3A18]/10 space-y-6">
          
          {/* Welcome Points Banner */}
          {isRegister && (
            <div className="bg-cream/60 border border-[#1F3A18]/20 rounded-xl p-3.5 flex items-center gap-3 text-xs font-poppins text-[#1F3A18]">
              <Sparkles className="w-5 h-5 text-[#1F3A18] shrink-0" />
              <span><strong>New Member Perk:</strong> 50 bonus loyalty points (₹50 instant discount) automatically credited to your new account!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-poppins flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-poppins text-xs sm:text-sm">
            {isRegister && (
              <div>
                <label className="block text-[#1F3A18] font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#1F3A18] font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com (or admin@bakerschoice.com)"
                className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]"
              />
            </div>

            <div>
              <label className="block text-[#1F3A18] font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? "Authenticating..." : (isRegister ? "Create Account" : "Sign In")}
            </Button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="pt-4 border-t border-gray-100 text-center font-poppins text-xs">
            {isRegister ? (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => { setIsRegister(false); setError(null); }}
                  className="text-[#1F3A18] font-bold underline underline-offset-2 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Don't have an account yet?{' '}
                <button
                  onClick={() => { setIsRegister(true); setError(null); }}
                  className="text-[#1F3A18] font-bold underline underline-offset-2 cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>

          {/* Admin shortcut tip */}
          <div className="text-[11px] font-poppins text-gray-400 text-center">
            Tip: Enter an email containing "admin" (e.g. <code>admin@bakerschoice.com</code>) to access the Owner Dashboard.
          </div>

        </div>
      </div>
    </div>
  );
}
