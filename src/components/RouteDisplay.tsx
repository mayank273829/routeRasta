import { useState, useEffect } from 'react';
import { Clock, IndianRupee, ArrowRight, Bus, Brain as Train, Car } from 'lucide-react';
import { RouteWithSteps } from '../App';
import { supabase } from '../lib/supabase';
import { TransportMode } from '../lib/database.types';
import MapView from './MapView';

interface RouteDisplayProps {
  routes: RouteWithSteps[];
}

export default function RouteDisplay({ routes }: RouteDisplayProps) {
  const [transportModes, setTransportModes] = useState<Record<string, TransportMode>>({});
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  useEffect(() => {
    const fetchTransportModes = async () => {
      const { data } = await supabase.from('transport_modes').select('*');
      if (data) {
        const modesMap = data.reduce((acc, mode) => {
          acc[mode.id] = mode;
          return acc;
        }, {} as Record<string, TransportMode>);
        setTransportModes(modesMap);
      }
    };
    fetchTransportModes();
  }, []);

  if (routes.length === 0) {
    return (
      <div className="mt-6 bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">No routes found. Try different locations or submit a route!</p>
      </div>
    );
  }

  const selectedRoute = routes[selectedRouteIndex];

  const getTransportIcon = (modeName: string) => {
    const name = modeName.toLowerCase();
    if (name.includes('bus')) return <Bus size={20} />;
    if (name.includes('train')) return <Train size={20} />;
    if (name.includes('auto') || name.includes('taxi')) return <Car size={20} />;
    return <ArrowRight size={20} />;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="mt-6 space-y-4">
      {routes.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Available Routes</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {routes.map((route, index) => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteIndex(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedRouteIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IndianRupee size={14} />
                  <span>{Math.round(route.total_cost_inr)}</span>
                  <span className="text-xs opacity-75">•</span>
                  <Clock size={14} />
                  <span>{formatTime(route.total_time_minutes)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {selectedRoute.start_location} → {selectedRoute.end_location}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedRoute.verified ? '✓ Verified Route' : 'Community Route'}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold text-green-600">
              <IndianRupee size={18} />
              <span>{Math.round(selectedRoute.total_cost_inr)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <Clock size={14} />
              <span>{formatTime(selectedRoute.total_time_minutes)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedRoute.steps.map((step, index) => {
            const mode = transportModes[step.transport_mode_id];
            return (
              <div
                key={step.id}
                className="border-l-4 border-blue-500 pl-4 py-2"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2 mt-1">
                    {mode ? getTransportIcon(mode.name) : <ArrowRight size={20} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-base">
                      Step {step.step_number}: {step.instructions}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.from_location} → {step.to_location}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(step.duration_minutes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee size={14} />
                        {Math.round(step.cost_inr)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total:</span>
            <div className="text-right">
              <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                <IndianRupee size={18} />
                <span>{Math.round(selectedRoute.total_cost_inr)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock size={14} />
                <span>{formatTime(selectedRoute.total_time_minutes)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MapView route={selectedRoute} />
    </div>
  );
}
