import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Settings } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to the TSLA Form Generation Portal. Choose an action below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/clients" className="block bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-tsla-red transition-colors group">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-tsla-red/10 rounded-md p-3">
                <Users className="h-6 w-6 text-tsla-red" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-lg font-medium text-gray-900 truncate">
                  Client Manager
                </dt>
                <dd className="flex items-baseline mt-1">
                  <p className="text-sm text-gray-500">
                    Manage client profiles and details
                  </p>
                </dd>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/settings" className="block bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-tsla-red transition-colors group">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-tsla-red/10 rounded-md p-3">
                <Settings className="h-6 w-6 text-tsla-red" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-lg font-medium text-gray-900 truncate">
                  Settings
                </dt>
                <dd className="flex items-baseline mt-1">
                  <p className="text-sm text-gray-500">
                    Configure agent & witness details
                  </p>
                </dd>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
