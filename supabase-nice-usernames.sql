-- Generate nice usernames for existing users
-- Run this in Supabase SQL Editor

-- Create a function to generate random usernames
CREATE OR REPLACE FUNCTION generate_random_username() 
RETURNS TEXT AS $$
DECLARE
    adjectives TEXT[] := ARRAY['Cool', 'Smart', 'Fast', 'Bright', 'Bold', 'Swift', 'Clever', 'Sharp', 'Quick', 'Wise'];
    nouns TEXT[] := ARRAY['Trader', 'Worker', 'Builder', 'Creator', 'Hunter', 'Solver', 'Maker', 'Finder', 'Helper', 'Doer'];
    adjective TEXT;
    noun TEXT;
    number INTEGER;
BEGIN
    adjective := adjectives[1 + floor(random() * array_length(adjectives, 1))];
    noun := nouns[1 + floor(random() * array_length(nouns, 1))];
    number := 1 + floor(random() * 999);
    
    RETURN adjective || noun || number;
END;
$$ LANGUAGE plpgsql;

-- Update existing users with nice usernames
UPDATE users 
SET username = generate_random_username()
WHERE username LIKE 'User%';

-- Drop the function (cleanup)
DROP FUNCTION generate_random_username();