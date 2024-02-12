FROM node:latest


# Définir le répertoire de travail dans le conteneur
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copier le package.json et le package-lock.json
# COPY ./dockers/node/tools/nodelauncher.sh ./
COPY ./project/package*.json ./

# Installer les dépendances du projet
# RUN npm install

# Copier le reste du code source de l'application
COPY ./project/ .

# Exposer le port 3000
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["tail", "-f", "/dev/null"]
#CMD ["npm", "start"]