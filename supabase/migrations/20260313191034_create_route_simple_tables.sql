/*
  # RouteSimple Database Schema

  1. New Tables
    - `transport_modes`
      - `id` (uuid, primary key)
      - `name` (text) - bus, train, auto, local transport, etc.
      - `icon` (text) - icon identifier
      - `created_at` (timestamp)
    
    - `routes`
      - `id` (uuid, primary key)
      - `start_location` (text) - starting point
      - `end_location` (text) - destination
      - `total_time_minutes` (integer) - total travel time
      - `total_cost_inr` (decimal) - total cost in rupees
      - `total_transfers` (integer) - number of transfers
      - `route_type` (text) - cheapest, fastest, balanced
      - `user_submitted` (boolean) - whether submitted by user
      - `verified` (boolean) - whether route is verified
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `route_steps`
      - `id` (uuid, primary key)
      - `route_id` (uuid, foreign key to routes)
      - `step_number` (integer) - order of the step
      - `transport_mode_id` (uuid, foreign key to transport_modes)
      - `from_location` (text) - starting point of this step
      - `to_location` (text) - ending point of this step
      - `duration_minutes` (integer) - time for this step
      - `cost_inr` (decimal) - cost for this step
      - `instructions` (text) - detailed instructions
      - `created_at` (timestamp)
    
    - `user_route_submissions`
      - `id` (uuid, primary key)
      - `user_email` (text) - optional email for contact
      - `start_location` (text)
      - `end_location` (text)
      - `route_description` (text) - user's route description
      - `estimated_time` (text) - user's time estimate
      - `estimated_cost` (text) - user's cost estimate
      - `status` (text) - pending, approved, rejected
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for routes and transport modes
    - Authenticated users can submit routes
    - Anyone can view route data
*/

-- Transport Modes Table
CREATE TABLE IF NOT EXISTS transport_modes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transport_modes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transport modes"
  ON transport_modes FOR SELECT
  TO public
  USING (true);

-- Routes Table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_location text NOT NULL,
  end_location text NOT NULL,
  total_time_minutes integer NOT NULL DEFAULT 0,
  total_cost_inr decimal(10,2) NOT NULL DEFAULT 0,
  total_transfers integer NOT NULL DEFAULT 0,
  route_type text NOT NULL DEFAULT 'balanced',
  user_submitted boolean DEFAULT false,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view routes"
  ON routes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert routes"
  ON routes FOR INSERT
  TO public
  WITH CHECK (true);

-- Route Steps Table
CREATE TABLE IF NOT EXISTS route_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  transport_mode_id uuid NOT NULL REFERENCES transport_modes(id),
  from_location text NOT NULL,
  to_location text NOT NULL,
  duration_minutes integer NOT NULL,
  cost_inr decimal(10,2) NOT NULL,
  instructions text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE route_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view route steps"
  ON route_steps FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert route steps"
  ON route_steps FOR INSERT
  TO public
  WITH CHECK (true);

-- User Route Submissions Table
CREATE TABLE IF NOT EXISTS user_route_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text,
  start_location text NOT NULL,
  end_location text NOT NULL,
  route_description text NOT NULL,
  estimated_time text,
  estimated_cost text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_route_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view submissions"
  ON user_route_submissions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can submit routes"
  ON user_route_submissions FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_routes_locations ON routes(start_location, end_location);
CREATE INDEX IF NOT EXISTS idx_route_steps_route_id ON route_steps(route_id);
CREATE INDEX IF NOT EXISTS idx_route_steps_step_number ON route_steps(step_number);