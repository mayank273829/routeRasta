import { MapPin } from 'lucide-react';
import { RouteWithSteps } from '../App';

interface MapViewProps {
  route: RouteWithSteps;
}

export default function MapView({ route }: MapViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Map</h3>

      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-3">
                <MapPin className="text-white" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2 max-w-[100px] break-words">
                {route.start_location}
              </p>
            </div>

            <div className="flex-1 border-t-2 border-dashed border-gray-400 min-w-[60px]" />

            <div className="flex flex-col items-center">
              <div className="bg-red-500 rounded-full p-3">
                <MapPin className="text-white" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2 max-w-[100px] break-words">
                {route.end_location}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-6">
            <p className="font-medium">{route.steps.length} stops along the way</p>
            <p className="text-xs mt-2 text-gray-500">
              Interactive map coming soon with detailed route visualization
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-600 mb-1">Starting Point</p>
          <p className="font-medium text-gray-800">{route.start_location}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-600 mb-1">Destination</p>
          <p className="font-medium text-gray-800">{route.end_location}</p>
        </div>
      </div>
    </div>
  );
}
