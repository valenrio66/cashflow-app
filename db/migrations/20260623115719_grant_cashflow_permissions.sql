-- migrate:up

GRANT USAGE ON SCHEMA cashflow TO anon, authenticated, service_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cashflow TO anon, authenticated, service_role;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA cashflow TO anon, authenticated, service_role;

GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA cashflow TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA cashflow GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA cashflow GRANT ALL PRIVILEGES ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA cashflow GRANT ALL PRIVILEGES ON ROUTINES TO anon, authenticated, service_role;


-- migrate:down
ALTER DEFAULT PRIVILEGES IN SCHEMA cashflow REVOKE ALL PRIVILEGES ON ROUTINES FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA cashflow REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA cashflow REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated, service_role;

REVOKE ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA cashflow FROM anon, authenticated, service_role;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA cashflow FROM anon, authenticated, service_role;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA cashflow FROM anon, authenticated, service_role;
REVOKE USAGE ON SCHEMA cashflow FROM anon, authenticated, service_role;