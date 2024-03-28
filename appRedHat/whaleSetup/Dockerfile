FROM node:21.6.2


# Définir le répertoire de travail dans le conteneur
RUN mkdir -p /usr/src/app && chmod -R 777 /usr/src/app
RUN mkdir -p /usr/src/appSetup
WORKDIR /usr/src/appSetup


COPY ./whaleSetup/docker-setup.sh .
RUN chmod +x docker-setup.sh

WORKDIR ../app


EXPOSE 3001

ENTRYPOINT ["../appSetup/docker-setup.sh"]
# CMD ["tail", "-f", "/dev/null"]