#!/bin/bash

chmod 777 -R ../app/

echo -e "\033[0;32mStart installing dependencies\033[0m"

echo -n "node version : "
echo $(node --version)

echo -n "npm version : "
echo $(npm --version)

# npm install


echo -e "\033[0;32mInstalling dependencies complete\033[0m"

tail -f /dev/null