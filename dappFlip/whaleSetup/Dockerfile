FROM node:16.20


# Définir le répertoire de travail dans le conteneur
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/appSetup
WORKDIR /usr/src/appSetup

# Copier le package.json et le package-lock.json
# COPY ./dockers/node/tools/nodelauncher.sh ./
# COPY ./project/package*.json .

# Copier le reste du code source de l'application
# COPY ./project/ .

COPY ./whaleSetup/docker-setup.sh .
RUN chmod +x docker-setup.sh

WORKDIR ../app

# Installer les dépendances du projet
# Can't using only `npm install` BROKEN TIMEOUT 
# RUN npm install -g truffle
# RUN npm install -g ganache
# RUN npm install @metamask/detect-provider@^1.2.0
# RUN npm install @rails/webpacker@^5.4.3
# RUN npm install @truffle/hdwallet-provider@^2.0.9
# RUN npm install dotenv@^16.0.1
# RUN npm install express@^4.18.1
# RUN npm install node_modules-path@^2.0.5
# RUN npm install truffle-hdwallet-provider@^1.0.17
# RUN npm install webpack@4
# RUN npm install webpack-cli@^4.10.0
# RUN npm install


# open port
EXPOSE 3000

# Commande par défaut pour démarrer l'application
ENTRYPOINT ["../appSetup/docker-setup.sh"]
# RUN ../appSetup/setup.sh
# CMD ["tail", "-f", "/dev/null"]
# CMD ["npm", "start"]