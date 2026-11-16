# Écrire sur le site

Tout le contenu que vous écrivez vous-même est dans ce dossier. Un fichier
texte par élément ; on pousse sur `main` et c'est en ligne.

## Un fragment (page d'accueil)

Un fragment est une idée courte, une image ou un lien. Créez
`content/fragments/NN-nom.md` (le numéro fixe l'ordre) :

    ---
    subjects: art, mémoire
    image: /fragments/ma-photo.jpg
    alt: Ce que montre l'image
    link: /writing/mon-article/
    size: wide
    ---
    La phrase du fragment.

- `subjects` : un ou plusieurs sujets, séparés par des virgules. Un fragment
  qui porte deux sujets est ce qui les relie sur la page d'accueil. Un sujet
  nouveau apparaît tout seul dans la liste.
- `image`, `alt`, `link`, `size` sont facultatifs. Les images vont dans
  `public/fragments/`.

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
