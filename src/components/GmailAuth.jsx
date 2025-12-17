import React, { useState, useEffect } from 'react';
import { Cloud, Loader2 } from 'lucide-react';
import gmailService from '../services/gmailService';

const GmailAuth = ({ onAuthenticated, isAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    // Get client ID from environment variable or prompt user
    const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (envClientId) {
      setClientId(envClientId);
      initializeAuth(envClientId);
    }
  }, []);

  const initializeAuth = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await gmailService.initialize();
      await gmailService.initTokenClient(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!clientId) {
      setError('Please enter your Google Client ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      if (!gmailService.isInitialized) {
        await gmailService.initialize();
      }
      
      if (!gmailService.tokenClient) {
        await gmailService.initTokenClient(clientId);
      }

      await gmailService.requestAccess();
      
      if (gmailService.isAuthenticated()) {
        onAuthenticated();
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate with Gmail');
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    gmailService.revokeAccess();
    window.location.reload();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-green-700">
          <Cloud size={16} />
          <span className="text-sm font-serif italic">Connected to Gmail</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 border-b border-stone-300 hover:border-stone-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-stone-200 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <Cloud size={24} className="text-blue-600" />
        <h2 className="text-xl font-serif italic text-stone-800">Connect Gmail</h2>
      </div>
      
      <p className="text-sm text-stone-600 mb-4 font-serif">
        Connect your Gmail account to display your real emails in this beautiful letter format.
      </p>

      {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
            Google Client ID
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your Google OAuth Client ID"
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
          />
          <p className="text-xs text-stone-400 mt-2">
            Get your Client ID from{' '}
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleSignIn}
        disabled={isLoading || (!clientId && !import.meta.env.VITE_GOOGLE_CLIENT_ID)}
        className="w-full bg-stone-800 text-stone-100 px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs uppercase tracking-widest">Connecting...</span>
          </>
        ) : (
          <>
            <Cloud size={16} />
            <span className="text-xs uppercase tracking-widest">Sign in with Google</span>
          </>
        )}
      </button>

      <div className="mt-4 text-xs text-stone-400 text-center">
        <p>We only request read-only access to your Gmail inbox.</p>
        <p className="mt-1">Your credentials are never stored.</p>
      </div>
    </div>
  );
};

export default GmailAuth;
