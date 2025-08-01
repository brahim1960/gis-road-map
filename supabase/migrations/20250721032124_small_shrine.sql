/*
  # Correction simple des politiques RLS pour la table profiles
  
  Le problème : Les nouveaux utilisateurs ne peuvent pas insérer leur profil
  lors de l'inscription car les politiques RLS bloquent l'insertion.
  
  Solution : Approche simple et directe sans pg_sleep
*/

-- Supprimer les politiques existantes une par une
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Managers can view team profiles" ON profiles;

-- Créer les nouvelles politiques avec des noms uniques

-- CRITIQUE: Politique pour permettre l'insertion du profil lors de l'inscription
CREATE POLICY "enable_insert_for_authenticated_users" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Politique pour la lecture de son propre profil
CREATE POLICY "enable_read_own_profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Politique pour la mise à jour de son propre profil
CREATE POLICY "enable_update_own_profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Politique pour les administrateurs (accès complet)
CREATE POLICY "enable_admin_access" 
  ON profiles FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'hr_manager')
    )
  );

-- S'assurer que RLS est activé
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Commentaire de confirmation
COMMENT ON TABLE profiles IS 'Politiques RLS simplifiées - inscription autorisée';