#!/bin/bash

echo -e "\033[0;32mStart installing dependencies\033[0m"

echo -n "node version : "
echo $(node --version)

echo -n "npm version : "
echo $(npm --version)

mkdir -p five_react
chmod -R 777 five_react

npm install -g create-react-app

cd five_react
# npm install --save-dev typescript
npm install



echo -e "\033[0;32mInstalling dependencies complete\033[0m"




tail -f /dev/null
# npm start