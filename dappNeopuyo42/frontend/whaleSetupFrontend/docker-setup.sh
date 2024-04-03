#!/bin/bash

echo -e "\033[0;32mStart installing dependencies\033[0m"

echo -n "node version : "
echo $(node --version)

echo -n "npm version : "
echo $(npm --version)

mkdir -p neopuyo42_react
chmod -R 777 neopuyo42_react

npm install -g create-next-app@latest

cd neopuyo42_react


npm install


echo -e "\033[0;32mInstalling dependencies complete\033[0m"



# To DEBUG or start build app
# tail -f /dev/null

# to run in developpement mode (with nextJs)
npm run dev

# to run in production mode
# npm run build