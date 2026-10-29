-- Option B: use an existing native PostgreSQL server instead of Docker.
-- Creates a dedicated, non-superuser role and database for local development.
--
-- Run once as your Postgres superuser (you will be prompted for its password):
--   psql -h localhost -p 5432 -U postgres -f infra/postgres/create_dev_db.sql
--
-- Then set in services/api/.env:
--   DATABASE_URL=postgresql+psycopg://moneymentor:moneymentor_dev@localhost:5432/moneymentor
--
-- The password is a throwaway local-dev credential. Never reuse it anywhere real.

CREATE ROLE moneymentor WITH LOGIN PASSWORD 'moneymentor_dev';
CREATE DATABASE moneymentor OWNER moneymentor;
