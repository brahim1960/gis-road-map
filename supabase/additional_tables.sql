-- Additional tables and columns for extended functionality

-- Ajouter des colonnes de latitude et longitude à la table profiles si elles n'existent pas déjà
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Ajouter des colonnes de latitude et longitude à la table clients si elles n'existent pas déjà
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Créer la table project_contracts si elle n'existe pas
CREATE TABLE IF NOT EXISTS project_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  description text,
  amount numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- Créer la table project_materials si elle n'existe pas
CREATE TABLE IF NOT EXISTS project_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  description text,
  cost numeric,
  created_at timestamp with time zone DEFAULT now()
);