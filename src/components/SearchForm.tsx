import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RouteWithSteps } from '../App';

interface SearchFormProps {
  onSearch: (from: string, to: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setRoutes: (routes: RouteWithSteps[]) => void;
}

export default function SearchForm({ onSearch, loading, setLoading, setRoutes }: SearchFormProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [preference, setPreference] = useState<'cheapest' | 'fastest' | 'least_transfers'>('cheapest');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;

    setLoading(true);
    onSearch(from, to);

    try {
      const { data: routes, error } = await supabase
        .from('routes')
        .select('*')
        .ilike('start_location', `%${from}%`)
        .ilike('end_location', `%${to}%`);

      if (error) throw error;

      if (routes && routes.length > 0) {
        const routesWithSteps = await Promise.all(
          routes.map(async (route) => {
            const { data: steps } = await supabase
              .from('route_steps')
              .select('*')
              .eq('route_id', route.id)
              .order('step_number');

            return {
              ...route,
              steps: steps || []
            };
          })
        );

        let filteredRoutes = [...routesWithSteps];
        if (preference === 'cheapest') {
          filteredRoutes.sort((a, b) => a.total_cost_inr - b.total_cost_inr);
        } else if (preference === 'fastest') {
          filteredRoutes.sort((a, b) => a.total_time_minutes - b.total_time_minutes);
        } else if (preference === 'least_transfers') {
          filteredRoutes.sort((a, b) => a.total_transfers - b.total_transfers);
        }

        setRoutes(filteredRoutes);
      } else {
        setRoutes([]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="space-y-3">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
              Starting Location
            </label>
            <input
              id="from"
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="E.g., Delhi, Ghaziabad"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-gray-400" size={24} />
          </div>

          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="E.g., Dehradun, Village name"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Route Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPreference('cheapest')}
              className={`py-2 px-3 text-sm rounded-lg font-medium transition ${
                preference === 'cheapest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cheapest
            </button>
            <button
              type="button"
              onClick={() => setPreference('fastest')}
              className={`py-2 px-3 text-sm rounded-lg font-medium transition ${
                preference === 'fastest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fastest
            </button>
            <button
              type="button"
              onClick={() => setPreference('least_transfers')}
              className={`py-2 px-3 text-sm rounded-lg font-medium transition ${
                preference === 'least_transfers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Least Transfers
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={20} />
          {loading ? 'Searching...' : 'Find Route'}
        </button>
      </form>
    </div>
  );
}
