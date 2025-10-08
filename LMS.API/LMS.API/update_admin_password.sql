-- Update admin password to Admin@123
-- This script updates the admin password in the database

UPDATE Admins 
SET Password = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE Email = 'admin@byway.com';

-- Verify the update
SELECT AdminId, Email, Password FROM Admins WHERE Email = 'admin@byway.com';
