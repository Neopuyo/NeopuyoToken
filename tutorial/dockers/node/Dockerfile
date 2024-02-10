FROM node:latest

COPY ./dockers/node/tools/nodelauncher.sh ./

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json (le cas échéant)
# COMMENTER POUR PREMIER COUP DE BALEINE
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste du code source de l'application
#COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["npm", "start"]

# Si besoin d'utiliser le script :
#ENTRYPOINT ["./nodelauncher.sh"]