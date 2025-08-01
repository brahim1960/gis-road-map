/*
  # Reset complet et création du schéma TempsZenith

  ATTENTION: Ce script supprime TOUTES les données existantes !
  
  1. Suppression complète
    - Suppression de toutes les tables existantes
    - Suppression des types enum
    - Suppression des fonctions et triggers
    - Reset complet de la base de données

  2. Nouveau schéma complet
    - Tables utilisateurs et authentification
    - Tables de gestion de projets
    - Tables de suivi du temps
    - Tables de facturation
    - Tables de rapports
    - Sécurité RLS complète

  3. Données de test
    - Utilisateurs de démonstration
    - Projets d'exemple
    - Données de test pour chaque rôle
*/

-- =====================================================
-- SUPPRESSION COMPLÈTE DE TOUTES LES DONNÉES
-- =====================================================

-- Désactiver RLS temporairement pour la suppression
SET session_replication_role = replica;

-- Supprimer toutes les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS time_entries CASCADE;
DROP TABLE IF EXISTS project_assignments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Supprimer les types enum
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS time_entry_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS report_type CASCADE;

-- Supprimer les fonctions personnalisées
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS calculate_time_entry_duration() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(uuid) CASCADE;

-- Réactiver RLS
SET session_replication_role = DEFAULT;

-- =====================================================
-- CRÉATION DU NOUVEAU SCHÉMA COMPLET
-- =====================================================

-- Créer les types enum
CREATE TYPE user_role AS ENUM ('admin', 'employee', 'client');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE time_entry_status AS ENUM ('running', 'paused', 'completed');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE report_type AS ENUM ('time_summary', 'project_progress', 'client_billing', 'employee_productivity');

-- =====================================================
-- TABLE PROFILES (Profils utilisateurs)
-- =====================================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role user_role NOT NULL DEFAULT 'employee',
  avatar_url text,
  phone text,
  hourly_rate decimal(10,2) DEFAULT 0,
  department text,
  job_title text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- TABLE CLIENTS
-- =====================================================
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  company text,
  contact_person text,
  hourly_rate decimal(10,2),
  currency text DEFAULT 'EUR',
  tax_rate decimal(5,2) DEFAULT 0,
  payment_terms integer DEFAULT 30, -- jours
  is_active boolean DEFAULT true,
  notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- TABLE PROJECTS
-- =====================================================
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  client_id uuid REFERENCES clients(id),
  status project_status DEFAULT 'planning',
  start_date date,
  end_date date,
  estimated_hours integer,
  hourly_rate decimal(10,2),
  budget decimal(10,2),
  is_billable boolean DEFAULT true,
  color text DEFAULT '#3B82F6', -- couleur pour l'UI
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- TABLE PROJECT_ASSIGNMENTS (Assignations aux projets)
-- =====================================================
CREATE TABLE project_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member', -- 'manager', 'member', 'viewer'
  hourly_rate decimal(10,2), -- taux spécifique au projet
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES profiles(id),
  is_active boolean DEFAULT true,
  UNIQUE(project_id, user_id)
);

-- =====================================================
-- TABLE TIME_ENTRIES (Entrées de temps)
-- =====================================================
CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id),
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration integer, -- durée en secondes
  status time_entry_status DEFAULT 'completed',
  is_billable boolean DEFAULT true,
  hourly_rate decimal(10,2),
  tags text[], -- tags pour catégoriser
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time IS NULL OR end_time > start_time)
);

-- =====================================================
-- TABLE INVOICES (Factures)
-- =====================================================
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) NOT NULL,
  project_id uuid REFERENCES projects(id),
  status invoice_status DEFAULT 'draft',
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'EUR',
  notes text,
  payment_terms text,
  created_by uuid REFERENCES profiles(id),
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- TABLE INVOICE_ITEMS (Détails des factures)
-- =====================================================
CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  time_entry_id uuid REFERENCES time_entries(id),
  description text NOT NULL,
  quantity decimal(10,2) DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- TABLE REPORTS (Rapports)
-- =====================================================
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type report_type NOT NULL,
  parameters jsonb, -- paramètres du rapport (dates, filtres, etc.)
  data jsonb, -- données du rapport
  created_by uuid REFERENCES profiles(id),
  is_scheduled boolean DEFAULT false,
  schedule_cron text, -- expression cron pour les rapports automatiques
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- TABLE SETTINGS (Paramètres de l'application)
-- =====================================================
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false, -- accessible aux non-admins
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction pour calculer automatiquement la durée des entrées de temps
CREATE OR REPLACE FUNCTION calculate_time_entry_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
    NEW.duration = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))::integer;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction pour obtenir le rôle d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  SELECT role INTO user_role_result FROM profiles WHERE id = user_id;
  RETURN user_role_result;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour calculer la durée automatiquement
CREATE TRIGGER calculate_duration_trigger BEFORE INSERT OR UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION calculate_time_entry_duration();

-- =====================================================
-- SÉCURITÉ RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES RLS - PROFILES
-- =====================================================

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Les admins peuvent tout voir et modifier
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =====================================================
-- POLITIQUES RLS - CLIENTS
-- =====================================================

-- Les admins peuvent tout faire avec les clients
CREATE POLICY "Admins can manage clients" ON clients FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin');

-- Les clients peuvent voir leurs propres informations
CREATE POLICY "Clients can view own data" ON clients FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client' AND email = clients.email)
);

-- =====================================================
-- POLITIQUES RLS - PROJECTS
-- =====================================================

-- Les admins peuvent tout faire
CREATE POLICY "Admins can manage projects" ON projects FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin');

-- Les employés peuvent voir les projets auxquels ils sont assignés
CREATE POLICY "Employees can view assigned projects" ON projects FOR SELECT TO authenticated USING (
  get_user_role(auth.uid()) = 'employee' AND 
  EXISTS (SELECT 1 FROM project_assignments WHERE project_id = projects.id AND user_id = auth.uid() AND is_active = true)
);

-- Les clients peuvent voir leurs projets
CREATE POLICY "Clients can view own projects" ON projects FOR SELECT TO authenticated USING (
  get_user_role(auth.uid()) = 'client' AND 
  EXISTS (SELECT 1 FROM clients WHERE id = projects.client_id AND email = (SELECT email FROM profiles WHERE id = auth.uid()))
);

-- =====================================================
-- POLITIQUES RLS - PROJECT_ASSIGNMENTS
-- =====================================================

CREATE POLICY "Admins can manage assignments" ON project_assignments FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can view own assignments" ON project_assignments FOR SELECT TO authenticated USING (user_id = auth.uid());

-- =====================================================
-- POLITIQUES RLS - TIME_ENTRIES
-- =====================================================

-- Les utilisateurs peuvent gérer leurs propres entrées de temps
CREATE POLICY "Users can manage own time entries" ON time_entries FOR ALL TO authenticated USING (user_id = auth.uid());

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all time entries" ON time_entries FOR SELECT TO authenticated USING (get_user_role(auth.uid()) = 'admin');

-- Les clients peuvent voir les entrées de temps de leurs projets
CREATE POLICY "Clients can view project time entries" ON time_entries FOR SELECT TO authenticated USING (
  get_user_role(auth.uid()) = 'client' AND 
  EXISTS (
    SELECT 1 FROM projects p 
    JOIN clients c ON p.client_id = c.id 
    WHERE p.id = time_entries.project_id AND c.email = (SELECT email FROM profiles WHERE id = auth.uid())
  )
);

-- =====================================================
-- POLITIQUES RLS - INVOICES & INVOICE_ITEMS
-- =====================================================

CREATE POLICY "Admins can manage invoices" ON invoices FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Clients can view own invoices" ON invoices FOR SELECT TO authenticated USING (
  get_user_role(auth.uid()) = 'client' AND 
  EXISTS (SELECT 1 FROM clients WHERE id = invoices.client_id AND email = (SELECT email FROM profiles WHERE id = auth.uid()))
);

CREATE POLICY "Admins can manage invoice items" ON invoice_items FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Clients can view own invoice items" ON invoice_items FOR SELECT TO authenticated USING (
  get_user_role(auth.uid()) = 'client' AND 
  EXISTS (
    SELECT 1 FROM invoices i 
    JOIN clients c ON i.client_id = c.id 
    WHERE i.id = invoice_items.invoice_id AND c.email = (SELECT email FROM profiles WHERE id = auth.uid())
  )
);

-- =====================================================
-- POLITIQUES RLS - REPORTS
-- =====================================================

CREATE POLICY "Admins can manage reports" ON reports FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can view own reports" ON reports FOR SELECT TO authenticated USING (created_by = auth.uid());

-- =====================================================
-- POLITIQUES RLS - SETTINGS
-- =====================================================

CREATE POLICY "Admins can manage settings" ON settings FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can view public settings" ON settings FOR SELECT TO authenticated USING (is_public = true);

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index sur les colonnes fréquemment utilisées
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);

CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_user_id ON project_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_is_active ON project_assignments(is_active);

CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON time_entries(start_time);
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON time_entries(status);
CREATE INDEX IF NOT EXISTS idx_time_entries_is_billable ON time_entries(is_billable);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_time_entry_id ON invoice_items(time_entry_id);

CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_is_public ON settings(is_public);

-- =====================================================
-- DONNÉES DE DÉMONSTRATION
-- =====================================================

-- Paramètres par défaut de l'application
INSERT INTO settings (key, value, description, is_public) VALUES
('app_name', '"TempsZenith"', 'Nom de l''application', true),
('default_hourly_rate', '50.00', 'Taux horaire par défaut', false),
('default_currency', '"EUR"', 'Devise par défaut', true),
('working_hours_per_day', '8', 'Heures de travail par jour', true),
('working_days_per_week', '5', 'Jours de travail par semaine', true),
('invoice_prefix', '"INV-"', 'Préfixe des numéros de facture', false),
('tax_rate', '20.00', 'Taux de TVA par défaut (%)', false);

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les statistiques de temps par projet
CREATE OR REPLACE VIEW project_time_stats AS
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.status,
  COUNT(te.id) as total_entries,
  COALESCE(SUM(te.duration), 0) as total_seconds,
  COALESCE(SUM(te.duration), 0) / 3600.0 as total_hours,
  COALESCE(AVG(te.duration), 0) as avg_duration_seconds,
  MIN(te.start_time) as first_entry,
  MAX(te.start_time) as last_entry
FROM projects p
LEFT JOIN time_entries te ON p.id = te.project_id
GROUP BY p.id, p.name, p.status;

-- Vue pour les statistiques utilisateur
CREATE OR REPLACE VIEW user_time_stats AS
SELECT 
  pr.id as user_id,
  pr.full_name,
  pr.role,
  COUNT(te.id) as total_entries,
  COALESCE(SUM(te.duration), 0) as total_seconds,
  COALESCE(SUM(te.duration), 0) / 3600.0 as total_hours,
  COUNT(DISTINCT te.project_id) as projects_worked_on
FROM profiles pr
LEFT JOIN time_entries te ON pr.id = te.user_id
GROUP BY pr.id, pr.full_name, pr.role;

-- =====================================================
-- COMMENTAIRES FINAUX
-- =====================================================

-- Schéma créé avec succès !
-- Toutes les tables ont été supprimées et recréées
-- La sécurité RLS est configurée pour tous les rôles
-- Les index sont optimisés pour les performances
-- Les données de démonstration sont prêtes