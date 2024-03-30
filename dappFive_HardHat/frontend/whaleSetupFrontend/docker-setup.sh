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



# To DEBUG
# tail -f /dev/null

# to run in developpement mode
npm start

# to run in production mode
# npm run build