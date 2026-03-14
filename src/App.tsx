import { useState } from 'react';
import SearchForm from './components/SearchForm';
import RouteDisplay from './components/RouteDisplay';
import SubmitRouteForm from './components/SubmitRouteForm';
import { Route, RouteStep } from './lib/database.types';

export interface RouteWithSteps extends Route {
  steps: RouteStep[];
}

function App() {
  const [routes, setRoutes] = useState<RouteWithSteps[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [searchParams, setSearchParams] = useState({ from: '', to: '' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            RouteSimple
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Find the simplest route across India
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <SearchForm
          onSearch={(from, to) => {
            setSearchParams({ from, to });
          }}
          loading={loading}
          setLoading={setLoading}
          setRoutes={setRoutes}
        />

        {routes.length > 0 && (
          <RouteDisplay routes={routes} />
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base underline"
          >
            {showSubmitForm ? 'Hide' : 'Know a better route? Submit it here'}
          </button>
        </div>

        {showSubmitForm && (
          <SubmitRouteForm
            defaultFrom={searchParams.from}
            defaultTo={searchParams.to}
            onSuccess={() => setShowSubmitForm(false)}
          />
        )}
      </main>

      <footer className="mt-16 py-6 text-center text-gray-600 text-sm">
        <p>Helping you travel across India, one step at a time</p>
      </footer>
    </div>
  );
}

export default App;
