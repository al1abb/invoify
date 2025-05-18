# Documentation du projet Invoify

## Présentation

**Invoify** est une application web de génération de factures, développée avec Next.js 13, TypeScript, React et la librairie UI Shadcn. Elle permet de créer, personnaliser, sauvegarder et exporter des factures professionnelles facilement.

---

## Fonctionnalités principales

- **Création rapide de factures** via un formulaire intuitif
- **Sauvegarde locale** des factures dans le navigateur
- **Chargement et gestion** des factures sauvegardées
- **Téléchargement** ou **envoi par email** des factures au format PDF
- **Choix de modèles de facture** (2 modèles inclus, le modèle 3 est exclu de cette documentation)
- **Aperçu en temps réel** lors de l’édition
- **Exportation** des factures en JSON, XLSX, CSV, XML
- **Support multilingue** (i18n)
- **Thème clair/sombre**

---

## Architecture et organisation

- **/app** : Pages et composants principaux de l’application (formulaire, aperçu, navigation, etc.)
- **/app/components/invoice** : Composants liés à la gestion des factures (formulaire, actions, aperçu, etc.)
- **/app/components/templates/invoice-pdf/** : Modèles de factures PDF (InvoiceTemplate1, InvoiceTemplate2)
- **/contexts** : Contexts React pour la gestion d’état (factures, thèmes, signatures, etc.)
- **/lib** : Fonctions utilitaires, helpers, variables globales
- **/public/assets** : Images, logos, données statiques (ex : devises)
- **/services** : Logique métier côté serveur (génération, export, envoi de factures)
- **/i18n** : Fichiers de traduction pour l’interface multilingue

---

## Fonctionnement général

1. **Saisie des informations** :
   - L’utilisateur remplit le formulaire de facture (émetteur, destinataire, détails, lignes, etc.)
   - Utilisation de React Hook Form pour la gestion des formulaires et de Zod pour la validation

2. **Choix du modèle** :
   - L’utilisateur sélectionne un modèle de facture (hors template 3)
   - Le composant `DynamicInvoiceTemplate` charge dynamiquement le modèle choisi

3. **Aperçu en temps réel** :
   - Les modifications du formulaire sont reflétées instantanément dans l’aperçu PDF

4. **Actions sur la facture** :
   - Sauvegarde locale, export (JSON, CSV, XLSX, XML), génération PDF, envoi par email
   - Utilisation de Puppeteer côté serveur pour la génération de PDF
   - Envoi d’email via Nodemailer (configuration requise dans `.env.local`)

5. **Internationalisation et thèmes** :
   - Support multilingue via `next-intl` et fichiers de traduction dans `/i18n/locales`
   - Thème clair/sombre via `next-themes`

---

## Installation et démarrage

1. **Prérequis** : Node.js et npm/pnpm installés
2. **Installation** :
   ```bash
   git clone <repo>
   cd invoify
   pnpm install
   ```
3. **Configuration de l’email (optionnel pour l’envoi de PDF)** :
   Créez un fichier `.env.local` :
   ```env
   NODEMAILER_EMAIL=your_email@example.com
   NODEMAILER_PW=your_email_password
   ```
4. **Lancement du serveur de développement** :
   ```bash
   pnpm dev
   ```
5. **Accès à l’application** :
   Ouvrez [http://localhost:3000](http://localhost:3000)

---

## Technologies utilisées

- **Next.js** (SSR, App Router)
- **TypeScript**
- **React**
- **Shadcn-UI**
- **Tailwind CSS**
- **React Hook Form**
- **Zod**
- **Puppeteer** (génération PDF)
- **Nodemailer** (envoi email)

---

## Structure des modèles de facture (hors template 3)

- **InvoiceTemplate1** et **InvoiceTemplate2** :
  - Affichage des informations de l’émetteur, du destinataire, des lignes de facture, totaux, notes, conditions de paiement, etc.
  - Utilisation de composants réutilisables et d’un layout commun (`InvoiceLayout`)
  - Les templates sont dynamiquement chargés selon le choix de l’utilisateur

---

## Personnalisation et extensions

- Ajout de nouveaux modèles : créer un fichier dans `/app/components/templates/invoice-pdf/` et l’ajouter dans le sélecteur de template
- Ajout de champs personnalisés : modifier le formulaire dans `/app/components/invoice/form/`
- Traductions : éditer ou ajouter des fichiers dans `/i18n/locales/`

---

## Limitations connues

- Le template 3 (Transcomis) n’est pas documenté ici
- Problèmes connus sous Firefox (voir README)

---

## Licence

MIT

---

## Ressources

- [Démo en ligne](https://invoify.vercel.app)
- [Discord](https://discord.gg/uhXKHbVKHZ)
