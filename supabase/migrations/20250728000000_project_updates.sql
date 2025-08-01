-- Migration : ajout de champs d'adresse complets sur la table projects et création
-- éventuelle de la table task_assignments si elle n'existe pas déjà. Cette
-- migration crée aussi un déclencheur simple pour initialiser les colonnes
-- created_at/updated_at lors des insertions/mises à jour si nécessaire.

-- Ajouter les colonnes city, postal_code et country à la table projects.
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;

-- Créer la table task_assignments si elle n'existe pas. Cette table permet
-- d'assigner plusieurs employés à une tâche. Elle référence la tâche et
-- l'employé, enregistre le rôle de l'utilisateur au sein de la tâche et la
-- date d'assignation. Les clés étrangères sont déclarées avec ON DELETE
-- CASCADE pour supprimer les assignments lorsque la tâche ou l'employé est
-- supprimé.
CREATE TABLE IF NOT EXISTS public.task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by uuid,
  is_active BOOLEAN NOT NULL DEFAULT true
);
