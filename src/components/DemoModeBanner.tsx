'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-teal-700">
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <p className="ml-3 font-medium truncate">
              <span className="md:hidden">You're in demo mode</span>
              <span className="hidden md:inline">
                You're using demo mode. Your data is stored locally and won't be saved permanently.
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <Link
              href="/auth"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50"
            >
              Sign up to save your data
            </Link>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="-mr-1 flex p-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
