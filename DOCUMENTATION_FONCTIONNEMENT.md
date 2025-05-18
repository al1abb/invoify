# Documentation du projet Invoify

## Présentation générale
Invoify est une application web de génération de factures, développée avec Next.js 13, TypeScript, React, et la librairie UI Shadcn. Elle permet de créer, personnaliser, visualiser et exporter des factures professionnelles facilement.

## Technologies principales
- **Next.js** : Framework React pour le rendu côté serveur (SSR) et la navigation côté client.
- **TypeScript** : Superset de JavaScript avec typage statique.
- **Shadcn-UI** : Librairie de composants UI modernes.
- **Tailwind CSS** : Framework CSS utilitaire.
- **React Hook Form** : Gestion avancée des formulaires.
- **Zod** : Validation de schémas TypeScript.
- **Puppeteer** : Génération de PDF via navigateur headless.
- **Nodemailer** : Envoi d'emails avec pièces jointes (PDF).

## Structure du projet
- `app/` : Contient les pages, layouts, et composants principaux de l'application.
  - `components/` : Composants réutilisables (formulaires, boutons, modals, templates de factures, etc).
  - `[locale]/` : Gestion multilingue (i18n) avec chargement dynamique des messages.
  - `api/` : Endpoints pour la génération, l'export et l'envoi de factures.
- `contexts/` : Contexts React pour la gestion globale (traductions, thèmes, signature, etc).
- `hooks/` : Hooks personnalisés (ex : gestion des devises, notifications).
- `lib/` : Fonctions utilitaires, helpers, variables globales, schémas de validation.
- `public/` : Assets statiques (images, données, favicons).
- `services/` : Logique métier côté client et serveur (ex : génération de PDF, envoi d'email).
- `types/` : Types TypeScript partagés.

## Fonctionnement global
1. **Création de facture** :
   - L'utilisateur remplit un formulaire multi-étapes (React Hook Form) pour saisir les informations de la facture (émetteur, destinataire, lignes, conditions, etc).
   - Les champs sont validés avec Zod.
2. **Aperçu en temps réel** :
   - Un composant de prévisualisation affiche la facture au format PDF en temps réel selon les données saisies.
   - Le template PDF est choisi dynamiquement (hors template 3) via un sélecteur.
3. **Export et envoi** :
   - L'utilisateur peut exporter la facture en PDF, JSON, XLSX, CSV, XML.
   - Il peut aussi envoyer la facture par email (Nodemailer).
4. **Personnalisation** :
   - Plusieurs templates de facture sont disponibles (hors template 3).
   - L'utilisateur peut choisir la langue, le thème (clair/sombre), et ajouter un logo/signature.
5. **Sauvegarde locale** :
   - Les factures peuvent être sauvegardées dans le navigateur pour une récupération ultérieure.

## Points techniques clés
- **Templates PDF dynamiques** :
  - Les templates sont importés dynamiquement selon l'ID choisi (ex : `InvoiceTemplate1`, `InvoiceTemplate2`).
  - Le composant `DynamicInvoiceTemplate` gère ce chargement dynamique.
- **Gestion multilingue (i18n)** :
  - Les traductions sont chargées dynamiquement selon la locale dans l'URL.
  - Un context React fournit la fonction `_t` pour traduire les clés dans toute l'application.
- **Thématisation** :
  - Utilisation de Tailwind CSS et de variables CSS pour supporter le mode clair/sombre.
- **Génération de PDF** :
  - Puppeteer est utilisé côté serveur pour générer un PDF à partir du rendu React.
- **Sécurité** :
  - Les données sensibles (ex : credentials email) sont stockées dans un fichier `.env.local` non versionné.

## Démarrage rapide
1. Cloner le repo et installer les dépendances :
   ```bash
   git clone https://github.com/al1abb/invoify.git
   cd invoify
   npm install
   ```
2. Créer un fichier `.env.local` pour la configuration email (voir README).
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
4. Accéder à l'application sur [http://localhost:3000](http://localhost:3000)

## Personnalisation et extension
- Ajouter de nouveaux templates PDF : créer un fichier dans `app/components/templates/invoice-pdf/` et l'ajouter au sélecteur (hors template 3).
- Ajouter de nouvelles langues : ajouter un fichier JSON dans `i18n/locales/`.
- Modifier les styles : éditer `globals.css` ou la config Tailwind.

## Licence
MIT. Voir le fichier LICENSE.

---

> **Note :** Cette documentation exclut volontairement toute explication sur le template 3 (Transcomis personnalisé).
