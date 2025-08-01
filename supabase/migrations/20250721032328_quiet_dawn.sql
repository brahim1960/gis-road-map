/*
  # Désactiver temporairement RLS sur la table profiles
  
  Le problème : Malgré toutes les politiques créées, les nouveaux utilisateurs
  ne peuvent toujours pas insérer leur profil lors de l'inscription.
  
  Solution temporaire : Désactiver RLS sur la table profiles pour permettre
  l'inscription, puis le réactiver avec des politiques simplifiées.
*/

-- Désactiver RLS temporairement sur la table profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes pour repartir à zéro
DROP POLICY IF EXISTS "enable_insert_for_authenticated_users" ON profiles;
DROP POLICY IF EXISTS "enable_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "enable_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "enable_admin_access" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;

-- Réactiver RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Créer une politique très permissive pour l'insertion
CREATE POLICY "allow_all_authenticated_insert" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Politique pour la lecture de son propre profil
CREATE POLICY "allow_own_profile_select" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Politique pour la mise à jour de son propre profil
CREATE POLICY "allow_own_profile_update" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Politique pour les administrateurs
CREATE POLICY "allow_admin_full_access" 
  ON profiles FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'hr_manager')
    )
  );

-- Commentaire de confirmation
COMMENT ON TABLE profiles IS 'RLS réactivé avec politique permissive pour insertion';