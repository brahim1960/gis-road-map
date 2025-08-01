@@ .. @@
-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
+CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL TO authenticated USING (get_user_role(auth.uid()) IN ('admin', 'hr_manager'));
CREATE POLICY "Managers can view team profiles" ON profiles FOR SELECT TO authenticated USING (