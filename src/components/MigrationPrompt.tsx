'use client';

import { useState } from 'react';
import { MigrationData } from '@/services/migrationService';

interface MigrationPromptProps {
  migrationData: MigrationData;
  onMigrate: () => Promise<void>;
  onSkip: () => void;
}

export default function MigrationPrompt({ migrationData, onMigrate, onSkip }: MigrationPromptProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMigrate = async () => {
    setLoading(true);
    setError(null);
    try {
      await onMigrate();
    } catch (err: any) {
      setError(err.message || 'Failed to migrate data');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100">
            <svg
              className="h-6 w-6 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
            Save Your Demo Data?
          </h3>
          <div className="mt-2 text-sm text-gray-500 text-center">
            <p>We found demo data on your device:</p>
            <ul className="mt-2 space-y-1">
              <li>• {migrationData.groupCount} group{migrationData.groupCount !== 1 ? 's' : ''}</li>
              <li>• {migrationData.expenseCount} expense{migrationData.expenseCount !== 1 ? 's' : ''}</li>
            </ul>
            <p className="mt-3">
              Would you like to save this data to your account?
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            Skip
          </button>
          <button
            onClick={handleMigrate}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
