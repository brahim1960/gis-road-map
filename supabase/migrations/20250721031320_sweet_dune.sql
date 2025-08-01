/*
  # Correction des politiques RLS pour la table profiles

  1. Problème
    - Les nouveaux utilisateurs ne peuvent pas créer leur profil lors de l'inscription
    - Violation de la politique RLS lors de l'insertion

  2. Solution
    - Ajouter une politique permettant aux utilisateurs authentifiés d'insérer leur propre profil
    - Corriger les politiques existantes si nécessaire
*/

-- Supprimer les anciennes politiques qui pourraient causer des conflits
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recréer les politiques avec les bonnes permissions
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- CRITIQUE: Politique pour permettre l'insertion du profil lors de l'inscription
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Politique pour les admins (si elle n'existe pas déjà)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins can manage all profiles'
  ) THEN
    CREATE POLICY "Admins can manage all profiles" 
      ON profiles FOR ALL 
      TO authenticated 
      USING (get_user_role(auth.uid()) IN ('admin', 'hr_manager'));
  END IF;
END $$;