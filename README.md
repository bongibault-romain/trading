
# Jeu d'échange

Le front-end a été développé avec [Next.js](https://nextjs.org/), en utilisant [socket.io](https://socket.io/) pour la gestion des WebSockets. Les icônes proviennent de [icones.js.org](https://icones.js.org/) et les images utilisées pour représenter les objets ont été trouvées sur [itch.io](https://ghostpixxells.itch.io/pixelfood).


## Lancer le projet localement

Cloner le projet

```bash
  git clone https://github.com/bongibault-romain/trading-game-server/
```

Aller dans le dossier du projet

```bash
  cd trading-game-server
```

Installer les dépendences

```bash
  npm install
```

Créer un fichier `.env` pour les variables d'environement, vous pouvez copier directer le fichier `.env.example`

```
NEXT_PUBLIC_API_URL=localhost:3333
```

Démarrer le serveur en mode dévelopment

```bash
  npm run dev
```

