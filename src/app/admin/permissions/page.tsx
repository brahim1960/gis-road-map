"use client"

import { useEffect, useState } from 'react'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '../../../lib/supabase/client'
import { useAuth } from '../../../hooks/useAuth'
import { Shield } from 'lucide-react'

// --- Types and Constants ---
const PERMISSIONS = [
  { id: 'manage_clients', name: 'Gérer les Clients' },
  { id: 'manage_projects', name: 'Gérer les Projets' },
  { id: 'manage_billing', name: 'Gérer la Facturation' },
  { id: 'view_analytics', name: 'Voir les Analytics' },
];

interface AdminEmployee {
  id: string;
  full_name: string;
  permissions: string[];
}

export default function PermissionsPage() {
  const { user } = useAuth()
  const [adminEmployees, setAdminEmployees] = useState<AdminEmployee[]>([])
  const [loading, setLoading] = useState(true)

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAdminsAndPermissions = async () => {
      const supabase = getSupabaseClient()
      setLoading(true)

      const { data: adminsData, error: adminsError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'admin_employee')
      
      if (adminsError) {
        console.error("Error fetching admin employees:", adminsError)
        setLoading(false)
        return
      }

      const { data: permissionsData, error: permissionsError } = await supabase
        .from('admin_permissions')
        .select('user_id, permission')

      if (permissionsError) {
        console.error("Error fetching permissions:", permissionsError)
      }

      const adminsWithPermissions = adminsData.map(admin => {
        const adminPermissions = permissionsData
          ?.filter(p => p.user_id === admin.id)
          .map(p => p.permission) || [];
        return { ...admin, permissions: adminPermissions };
      });

      setAdminEmployees(adminsWithPermissions)
      setLoading(false)
    }

    if (user?.role === 'super_admin') {
      fetchAdminsAndPermissions()
    }
  }, [user])

  // --- Event Handlers ---
  const handlePermissionToggle = async (userId: string, permission: string) => {
    const supabase = getSupabaseClient()
    const hasPermission = adminEmployees.find(e => e.id === userId)?.permissions.includes(permission);

    // Optimistic UI update
    const originalAdmins = adminEmployees;
    const updatedAdmins = adminEmployees.map(e => {
        if (e.id === userId) {
            const newPermissions = hasPermission
                ? e.permissions.filter(p => p !== permission)
                : [...e.permissions, permission];
            return { ...e, permissions: newPermissions };
        }
        return e;
    });
    setAdminEmployees(updatedAdmins);

    if (hasPermission) {
      // Delete the permission
      const { error } = await supabase
        .from('admin_permissions')
        .delete()
        .match({ user_id: userId, permission: permission })
      if (error) {
        setAdminEmployees(originalAdmins); // Revert on error
        alert("Erreur lors de la suppression de la permission.");
      }
    } else {
      // Insert the new permission
      const { error } = await supabase
        .from('admin_permissions')
        .insert({ user_id: userId, permission: permission })
       if (error) {
        setAdminEmployees(originalAdmins); // Revert on error
        alert("Erreur lors de l'ajout de la permission.");
      }
    }
  };
  
  if (user?.role !== 'super_admin') {
      return (
          <DashboardLayout title="Accès non autorisé" navigation={adminNavigation}>
              <div className="p-6 bg-white shadow-sm rounded-lg">
                  <p>Vous n'avez pas les permissions nécessaires pour voir cette page.</p>
              </div>
          </DashboardLayout>
      )
  }

  return (
    <DashboardLayout title="Gestion des Permissions Admin" navigation={adminNavigation}>
      <div className="mt-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-indigo-600" />
              Permissions des Employés Admin
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Attribuez des droits spécifiques à vos employés administratifs.
            </p>
          </div>
          
          {loading ? (
            <p className="p-6 text-center">Chargement...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé Admin</th>
                    {PERMISSIONS.map(perm => (
                      <th key={perm.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{perm.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.full_name}</td>
                      {PERMISSIONS.map(perm => (
                        <td key={perm.id} className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={employee.permissions.includes(perm.id)}
                            onChange={() => handlePermissionToggle(employee.id, perm.id)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
