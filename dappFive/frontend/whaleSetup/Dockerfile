FROM node:21.7.1


# Définir le répertoire de travail dans le conteneur
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/appSetup
WORKDIR /usr/src/appSetup

COPY ./whaleSetup/docker-setup.sh .
RUN chmod +x docker-setup.sh

WORKDIR ../app

# open port
EXPOSE 3000

# Commande par défaut pour démarrer l'application
ENTRYPOINT ["../appSetup/docker-setup.sh"]