# Guide expert : Créer un template de facture totalement personnalisé dans Invoify

Ce guide va plus loin que la simple duplication d’un template existant. Il détaille toutes les étapes pour concevoir un template de facture unique, avec des champs, une logique métier, une structure et un rendu PDF sur-mesure, tout en assurant la compatibilité avec l’écosystème Invoify (formulaire, validation, export, i18n, etc.).

---

## 1. Analyse préalable et conception

Avant de coder, posez-vous les questions suivantes :
- Quels champs spécifiques (simples ou complexes) doivent figurer sur la facture ?
- Y a-t-il des sections conditionnelles, des tableaux dynamiques, des totaux personnalisés, des signatures, des annexes, des QR codes, etc. ?
- Quels calculs ou règles métier sont nécessaires (ex : taxes multi-taux, remises, acomptes, échéanciers) ?
- Quelles contraintes légales ou de branding (mentions, logos, couleurs, polices, etc.) ?
- Faut-il des interactions spécifiques (ex : champs éditables dans l’aperçu, signatures, etc.) ?

Réalisez un schéma ou un wireframe du rendu attendu.

---

## 2. Extension du modèle de données

- Modifiez `InvoiceType` dans `/types.ts` pour ajouter vos nouveaux champs (ex : `tva`, `qrCodeData`, `annexes`, etc.).
- Si certains champs sont optionnels ou conditionnels, utilisez les types TypeScript appropriés (`?`, `Partial`, etc.).
- Ajoutez/éditez les types imbriqués si besoin (ex : tableau d’échéances, objets pour annexes, etc.).

---

## 3. Adaptation du formulaire utilisateur

- Ajoutez les nouveaux champs dans `/app/components/invoice/form/` (sections ou nouveaux composants).
- Utilisez React Hook Form pour la gestion des valeurs et de la validation.
- Si besoin, créez des composants de formulaire réutilisables (ex : sélecteur de taux, éditeur de texte enrichi, upload de fichiers, etc.).
- Gérez la validation avancée avec Zod dans `/lib/schemas.ts` (ex : règles conditionnelles, formats personnalisés, valeurs calculées, etc.).
- Ajoutez la persistance locale si nécessaire (sauvegarde/restauration de brouillons).

---

## 4. Création du template PDF personnalisé

- Créez un fichier (ex : `InvoiceTemplateUltraCustom.tsx`) dans `/app/components/templates/invoice-pdf/`.
- Utilisez `InvoiceLayout` pour l’enveloppe, ou créez votre propre layout si besoin.
- Structurez le rendu selon vos besoins (sections, tableaux, colonnes, etc.).
- Utilisez Tailwind CSS pour le style, ou ajoutez du CSS custom pour des besoins avancés.
- Intégrez les nouveaux champs, avec gestion des cas particuliers (affichage conditionnel, calculs dynamiques, etc.).
- Pour les éléments complexes (QR code, annexes, images, etc.), utilisez des librairies adaptées (ex : `qrcode.react`, `react-pdf`, etc.) et vérifiez la compatibilité SSR/PDF.
- Ajoutez des hooks ou helpers pour les calculs ou la logique métier.

---

## 5. Gestion de l’aperçu dynamique et du sélecteur

- Ajoutez une image d’aperçu dans `/public/assets/img/`.
- Modifiez `/app/components/invoice/form/TemplateSelector.tsx` pour référencer le nouveau template (id, nom, description, image, composant).
- Vérifiez la cohérence de l’id avec le chargement dynamique dans `DynamicInvoiceTemplate.tsx`.
- Si votre template nécessite un chargement spécial (nom de fichier non standard, logique conditionnelle), adaptez la logique de chargement dynamique.

---

## 6. Internationalisation avancée

- Utilisez le hook `useTranslations` ou le composant `FormattedMessage` de `next-intl` pour tous les textes statiques ou dynamiques.
- Ajoutez les clés de traduction dans tous les fichiers de `/i18n/locales/`.
- Pour les champs dynamiques, prévoyez la traduction des labels, placeholders, messages d’erreur, etc.

---

## 7. Export PDF et compatibilité serveur

- Testez l’export PDF via Puppeteer (menu d’actions de la facture).
- Évitez les composants ou styles incompatibles avec le rendu serveur (pas d’animations, pas de hooks côté client, pas d’images distantes non accessibles en SSR, etc.).
- Pour les polices personnalisées, importez-les globalement (voir `/app/layout.tsx`).
- Vérifiez le rendu sur différents navigateurs et supports.

---

## 8. Gestion des cas avancés

- **Champs calculés** : Ajoutez des helpers dans `/lib/helpers.ts` pour centraliser la logique métier.
- **Sections optionnelles** : Utilisez des conditions d’affichage claires et des valeurs par défaut.
- **Annexes ou pièces jointes** : Gérez l’upload, la prévisualisation et l’inclusion dans le PDF.
- **Signatures électroniques** : Intégrez la gestion de signature (voir `/contexts/SignatureContext.tsx`).
- **QR codes, codes-barres** : Utilisez une librairie compatible SSR (ex : `qrcode.react` ou générateur côté serveur).
- **Mentions légales dynamiques** : Prévoyez des champs éditables ou des templates de mentions.

---

## 9. Accessibilité et responsive design

- Utilisez des balises sémantiques HTML5.
- Vérifiez la lisibilité (contraste, taille de police, etc.).
- Testez le rendu sur mobile et desktop.
- Ajoutez des attributs ARIA si besoin.

---

## 10. Tests et validation

- Vérifiez l’aperçu en temps réel, l’export PDF, la sauvegarde/restauration, l’envoi par email.
- Testez les cas limites (champs vides, valeurs extrêmes, erreurs de validation, etc.).
- Demandez un retour utilisateur ou faites une revue croisée.

---

## 11. Optimisations et bonnes pratiques

- Factorisez les composants réutilisables.
- Documentez chaque champ ou section complexe dans le code.
- Utilisez des hooks personnalisés pour la logique métier avancée.
- Gardez le code du template lisible et modulaire.

---

## 12. Exemple d’intégration avancée (QR code + annexes)

1. Ajoutez `qrCodeData` et `annexes` dans `InvoiceType`.
2. Installez une librairie QR code compatible SSR.
3. Dans le template :

```tsx
import QRCode from 'qrcode.react';
// ...
{data.details.qrCodeData && (
  <QRCode value={data.details.qrCodeData} size={128} />
)}
{data.details.annexes?.length > 0 && (
  <section>
    <h3>Annexes</h3>
    <ul>
      {data.details.annexes.map((annexe, idx) => (
        <li key={idx}>{annexe.titre} - {annexe.description}</li>
      ))}
    </ul>
  </section>
)}
```

---

## 13. Ressources utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Discord Invoify](https://discord.gg/uhXKHbVKHZ)

---

N’hésitez pas à consulter la documentation principale, à ouvrir des issues ou à demander de l’aide sur le Discord du projet !
