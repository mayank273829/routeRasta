import { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SubmitRouteFormProps {
  defaultFrom?: string;
  defaultTo?: string;
  onSuccess: () => void;
}

export default function SubmitRouteForm({ defaultFrom = '', defaultTo = '', onSuccess }: SubmitRouteFormProps) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('user_route_submissions')
        .insert({
          start_location: from,
          end_location: to,
          user_email: email || null,
          route_description: description,
          estimated_time: estimatedTime || null,
          estimated_cost: estimatedCost || null,
          status: 'pending'
        });

      if (error) throw error;

      setMessage('Thank you! Your route has been submitted for review.');
      setFrom('');
      setTo('');
      setEmail('');
      setDescription('');
      setEstimatedTime('');
      setEstimatedCost('');

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error submitting route:', error);
      setMessage('Failed to submit route. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Submit a Better Route</h2>
      <p className="text-sm text-gray-600 mb-4">
        Help others by sharing your knowledge of routes, especially to villages and remote areas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="submit-from" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              id="submit-from"
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Starting location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="submit-to" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              id="submit-to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destination"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Route Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the route step by step. Example: Take bus from X to Y, then auto from Y to Z..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time
            </label>
            <input
              id="time"
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="E.g., 4-5 hours"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Cost
            </label>
            <input
              id="cost"
              type="text"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="E.g., 500-600 rupees"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">We'll contact you if we need clarification</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('Thank you')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
          {submitting ? 'Submitting...' : 'Submit Route'}
        </button>
      </form>
    </div>
  );
}
