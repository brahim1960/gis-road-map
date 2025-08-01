/*
  # Correction finale des politiques RLS pour la table profiles
  
  Le problème : Les nouveaux utilisateurs ne peuvent pas insérer leur profil
  lors de l'inscription car les politiques RLS bloquent l'insertion.
  
  Solution : Créer une politique spécifique qui permet aux utilisateurs
  authentifiés d'insérer leur propre profil uniquement.
*/

-- Désactiver temporairement RLS pour nettoyer
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer TOUTES les politiques existantes
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Réactiver RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles politiques dans le bon ordre

-- 1. Politique pour l'insertion (CRITIQUE pour l'inscription)
CREATE POLICY "allow_insert_own_profile" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- 2. Politique pour la lecture de son propre profil
CREATE POLICY "allow_select_own_profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- 3. Politique pour la mise à jour de son propre profil
CREATE POLICY "allow_update_own_profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- 4. Politique pour les administrateurs (accès complet)
CREATE POLICY "allow_admin_all_access" 
  ON profiles FOR ALL 
  TO authenticated 
  USING (
    id IN (
      SELECT id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'hr_manager')
    )
  );

-- 5. Politique pour les managers (lecture des profils d'équipe)
CREATE POLICY "allow_manager_team_access" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role = 'project_manager'
    ) 
    AND id IN (
      SELECT pa.user_id 
      FROM project_assignments pa 
      WHERE pa.project_id IN (
        SELECT project_id 
        FROM project_assignments 
        WHERE user_id = auth.uid() 
        AND role = 'manager'
      )
    )
  );

-- Vérifier que RLS est activé
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Commentaire de confirmation
COMMENT ON TABLE profiles IS 'Politiques RLS corrigées - inscription autorisée';