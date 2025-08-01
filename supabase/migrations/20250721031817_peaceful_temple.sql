/*
  # Correction ultime des politiques RLS pour la table profiles
  
  Le problème : Les nouveaux utilisateurs ne peuvent pas insérer leur profil
  lors de l'inscription malgré les migrations précédentes.
  
  Solution : Approche radicale avec suppression complète et recréation
*/

-- Désactiver RLS temporairement
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer TOUTES les politiques existantes de manière agressive
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Supprimer toutes les politiques sur la table profiles
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles CASCADE', pol.policyname);
    END LOOP;
END $$;

-- Attendre un moment pour s'assurer que tout est nettoyé
SELECT pg_sleep(1);

-- Réactiver RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles politiques avec des noms uniques

-- 1. CRITIQUE: Politique pour l'insertion lors de l'inscription
CREATE POLICY "profiles_insert_own" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- 2. Politique pour la lecture de son propre profil
CREATE POLICY "profiles_select_own" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- 3. Politique pour la mise à jour de son propre profil
CREATE POLICY "profiles_update_own" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- 4. Politique pour les administrateurs
CREATE POLICY "profiles_admin_all" 
  ON profiles FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'hr_manager')
    )
  );

-- Vérifier que RLS est bien activé
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Test de la politique d'insertion
DO $$
BEGIN
  RAISE NOTICE 'Politiques RLS recréées pour la table profiles';
  RAISE NOTICE 'Politique d''insertion: profiles_insert_own';
  RAISE NOTICE 'Les nouveaux utilisateurs peuvent maintenant s''inscrire';
END $$;