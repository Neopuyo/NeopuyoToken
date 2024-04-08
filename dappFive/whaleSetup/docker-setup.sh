#!/bin/bash

echo -e "\033[0;32mStart installing dependencies\033[0m"

echo -n "node version : "
echo $(node --version)

echo -n "npm version : "
echo $(npm --version)

npm install -g truffle
npm install -g ganache

# for advanced parts (tuto part 2)
npm install truffle-assertions
npm install chai


npm install

echo -e "\033[0;32mInstalling dependencies complete\033[0m"

tail -f /dev/null