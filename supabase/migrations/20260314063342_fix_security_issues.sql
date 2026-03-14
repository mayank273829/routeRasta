/*
  # Fix Security Issues

  1. Add Missing Index
    - Create index on `transport_mode_id` foreign key for optimal query performance
  
  2. Remove Unused Indexes
    - Remove `idx_routes_locations` (not being used)
    - Remove `idx_route_steps_step_number` (not being used)
  
  3. Fix RLS Policies
    - Make INSERT policies more restrictive by validating data
    - Only allow submissions with required fields populated
  
  4. Auth Configuration
    - This is a project-level setting handled through Supabase dashboard settings
*/

-- Add index for foreign key to prevent query performance issues
CREATE INDEX IF NOT EXISTS idx_route_steps_transport_mode_id 
  ON route_steps(transport_mode_id);

-- Remove unused indexes
DROP INDEX IF EXISTS idx_routes_locations;
DROP INDEX IF EXISTS idx_route_steps_step_number;

-- Drop and recreate INSERT policies with proper validation

-- Routes: Allow inserts but validate required fields
DROP POLICY IF EXISTS "Anyone can insert routes" ON routes;
CREATE POLICY "Restricted route insertion"
  ON routes FOR INSERT
  TO public
  WITH CHECK (
    start_location IS NOT NULL AND
    end_location IS NOT NULL AND
    total_time_minutes >= 0 AND
    total_cost_inr >= 0
  );

-- Route Steps: Allow inserts but validate required fields
DROP POLICY IF EXISTS "Anyone can insert route steps" ON route_steps;
CREATE POLICY "Restricted route step insertion"
  ON route_steps FOR INSERT
  TO public
  WITH CHECK (
    route_id IS NOT NULL AND
    step_number > 0 AND
    transport_mode_id IS NOT NULL AND
    from_location IS NOT NULL AND
    to_location IS NOT NULL AND
    duration_minutes > 0 AND
    cost_inr >= 0 AND
    instructions IS NOT NULL
  );

-- User Submissions: Allow inserts but validate required fields
DROP POLICY IF EXISTS "Anyone can submit routes" ON user_route_submissions;
CREATE POLICY "Restricted route submission"
  ON user_route_submissions FOR INSERT
  TO public
  WITH CHECK (
    start_location IS NOT NULL AND
    end_location IS NOT NULL AND
    route_description IS NOT NULL AND
    length(route_description) > 10
  );
