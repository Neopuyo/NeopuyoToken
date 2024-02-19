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

# npm install @metamask/detect-provider@^1.2.0
# npm install @rails/webpacker@^5.4.3
# npm install @truffle/hdwallet-provider@^2.0.9
# npm install dotenv@^16.0.1
# npm install express@^4.18.1
# npm install node_modules-path@^2.0.5
# npm install truffle-hdwallet-provider@^1.0.17
# npm install webpack@4
# npm install webpack-cli@^4.10.0

# # module missing in tutorial (use deprecated name)
# npm install --save-dev truffle-contract

echo -e "\033[0;32mInstalling dependencies complete\033[0m"

tail -f /dev/null