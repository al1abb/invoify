# Personnalisation des Templates de Facture

Ce guide explique comment personnaliser ou ajouter de nouveaux templates de facture dans le projet Invoify.

---

## 1. Structure des templates

Les templates de facture sont situés dans le dossier :

```
/app/components/templates/invoice-pdf/
```

Chaque template est un composant React TypeScript (ex : `InvoiceTemplate1.tsx`, `InvoiceTemplate2.tsx`).

---

## 2. Ajouter un nouveau template

1. **Créer un nouveau fichier**
   - Copiez un template existant (ex : `InvoiceTemplate1.tsx`) et renommez-le (ex : `InvoiceTemplate4.tsx`).
   - Modifiez la structure, le style et les champs selon vos besoins.

2. **Respecter la signature**
   - Le composant doit recevoir un objet de type `InvoiceType` en props.
   - Utilisez les données `sender`, `receiver`, `details` pour afficher les informations de la facture.

3. **Utiliser le layout commun**
   - Enveloppez le contenu du template avec le composant `InvoiceLayout` pour garder une cohérence visuelle.

4. **Ajouter une image d’aperçu**
   - Placez une image d’aperçu dans `/public/assets/img/` (ex : `invoice-4-example.png`).

5. **Déclarer le template dans le sélecteur**
   - Ouvrez `/app/components/invoice/form/TemplateSelector.tsx`.
   - Ajoutez une entrée dans le tableau `templates` avec l’id, le nom, la description, l’image et le composant du nouveau template.

---

## 3. Personnaliser un template existant

- Modifiez le fichier du template concerné dans `/app/components/templates/invoice-pdf/`.
- Vous pouvez changer la mise en page, les couleurs, les polices, ou ajouter des champs personnalisés.
- Pour ajouter des champs dynamiques, adaptez aussi le formulaire dans `/app/components/invoice/form/` et le type `InvoiceType` dans `/types.ts`.

---

## 4. Utilisation des helpers et variables

- Utilisez les fonctions utilitaires de `/lib/helpers.ts` pour le formatage (ex : format des montants).
- Les constantes globales (devises, options de date, etc.) sont dans `/lib/variables.ts`.

---

## 5. Internationalisation

- Pour rendre un template multilingue, utilisez les clés de traduction présentes dans `/i18n/locales/`.
- Utilisez le hook ou composant de traduction fourni par `next-intl`.

---

## 6. Aperçu dynamique

- Le composant `DynamicInvoiceTemplate` charge dynamiquement le template sélectionné par l’utilisateur.
- Vérifiez que l’id de votre template est bien unique et cohérent avec le sélecteur.

---

## 7. Conseils

- Gardez une structure claire et des styles cohérents avec le reste de l’application.
- Testez l’aperçu en temps réel et l’export PDF pour valider le rendu.

---

## 8. Exemple d’ajout rapide

1. Créez `InvoiceTemplate4.tsx` dans `/app/components/templates/invoice-pdf/`.
2. Ajoutez l’image d’aperçu dans `/public/assets/img/invoice-4-example.png`.
3. Modifiez `TemplateSelector.tsx` pour référencer le nouveau template.
4. Redémarrez le serveur de développement si besoin.

---

## 9. Aller plus loin

- Pour des besoins avancés (champs dynamiques, calculs personnalisés, etc.), adaptez le schéma de données dans `/types.ts` et la logique métier dans `/services/invoice/`.

---

Pour toute question, consultez la documentation principale ou le canal Discord du projet.
