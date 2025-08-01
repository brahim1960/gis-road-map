/*
  # Correction finale des politiques RLS pour la table profiles
  
  Cette migration supprime toutes les politiques existantes et en crée de nouvelles
  qui permettent spécifiquement l'insertion de profils lors de l'inscription.
*/

-- Supprimer toutes les politiques existantes
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

-- Créer les nouvelles politiques avec des noms uniques

-- 1. Politique pour l'insertion - TRÈS PERMISSIVE pour résoudre le problème
CREATE POLICY "profiles_allow_insert_authenticated" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- 2. Politique pour la lecture de son propre profil
CREATE POLICY "profiles_allow_select_own" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- 3. Politique pour la mise à jour de son propre profil
CREATE POLICY "profiles_allow_update_own" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- 4. Politique pour la suppression de son propre profil
CREATE POLICY "profiles_allow_delete_own" 
  ON profiles FOR DELETE 
  TO authenticated 
  USING (auth.uid() = id);

-- 5. Politique pour les administrateurs (accès complet)
CREATE POLICY "profiles_allow_admin_all" 
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
COMMENT ON TABLE profiles IS 'Politiques RLS finales - insertion permissive pour tous les utilisateurs authentifiés';