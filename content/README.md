# Écrire sur le site

Le fonctionnement complet (couches raw / wiki, ingestion par un agent) est
décrit dans `WIKI.md`. Pour ajouter un fragment à la main, ajoutez aussi
`stage`, `planted` et `tended` (voir `WIKI.md`).

Tout le contenu que vous écrivez vous-même est dans ce dossier. Un fichier
texte par élément ; on pousse sur `main` et c'est en ligne.

## Une page du jardin (page d'accueil)

Un fragment est une idée courte, une image ou un lien. Créez
`content/wiki/NN-nom.md` (le numéro fixe l'ordre) :

    ---
    subjects: art, mémoire
    image: /wiki/ma-photo.jpg
    alt: Ce que montre l'image
    link: /writing/mon-article/
    size: wide
    ---
    La phrase du fragment.

- `subjects` : un ou plusieurs sujets, séparés par des virgules. Un fragment
  qui porte deux sujets est ce qui les relie sur la page d'accueil. Un sujet
  nouveau apparaît tout seul dans la liste.
- `image`, `alt`, `link`, `size` sont facultatifs. Les images vont dans
  `public/wiki/`.

## Un article (blog)

Créez `content/writing/AAAA-MM-JJ-titre.md` :

    ---
    title: Le titre
    dek: Une phrase de présentation
    subjects: art
    ---
    Le texte, en Markdown.

La date vient du nom du fichier. L'article apparaît dans « Writing », dans le
flux RSS et comme fragment sur la page d'accueil. Les images vont dans
`public/writing/`.

## Brouillons

Ajoutez `draft: true` dans l'en-tête : le fichier n'est visible qu'en local
(`npm run dev`), jamais sur le site publié.
