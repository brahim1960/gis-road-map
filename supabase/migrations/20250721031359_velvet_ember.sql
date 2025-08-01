/*
  # Correction définitive des politiques RLS pour la table profiles

  1. Problème
    - Les nouveaux utilisateurs ne peuvent pas créer leur profil lors de l'inscription
    - Violation de la politique RLS lors de l'insertion dans la table profiles

  2. Solution
    - Supprimer toutes les politiques existantes pour éviter les conflits
    - Recréer les politiques avec les bonnes permissions
    - Ajouter une politique spécifique pour l'insertion de profils
*/

-- Supprimer TOUTES les politiques existantes sur la table profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Managers can view team profiles" ON profiles;

-- Recréer les politiques avec les bonnes permissions

-- 1. Politique pour que les utilisateurs puissent voir leur propre profil
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- 2. Politique pour que les utilisateurs puissent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- 3. CRITIQUE: Politique pour permettre l'insertion du profil lors de l'inscription
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- 4. Politique pour les administrateurs (accès complet)
CREATE POLICY "Admins can manage all profiles" 
  ON profiles FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'hr_manager')
    )
  );

-- 5. Politique pour les managers de projet (lecture des profils d'équipe)
CREATE POLICY "Managers can view team profiles" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'project_manager'
    ) AND 
    EXISTS (
      SELECT 1 FROM project_assignments pa 
      WHERE pa.user_id = profiles.id 
      AND pa.project_id IN (
        SELECT project_id 
        FROM project_assignments 
        WHERE user_id = auth.uid() 
        AND role = 'manager'
      )
    )
  );

-- Vérifier que RLS est bien activé
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Commentaire de confirmation
COMMENT ON TABLE profiles IS 'Table des profils utilisateurs avec politiques RLS corrigées pour permettre l''inscription';