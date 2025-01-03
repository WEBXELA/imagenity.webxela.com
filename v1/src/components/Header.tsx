import React from 'react';
import { Wand2, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DownloadButton } from './download/DownloadButton';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Wand2 className="w-6 h-6 text-blue-600" />
        <span className="font-semibold text-gray-900">Imagenity</span>
      </div>
      
      <div className="flex items-center gap-4">
        <DownloadButton />
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
            Sign up free
          </button>
        )}
      </div>
    </header>
  );
}