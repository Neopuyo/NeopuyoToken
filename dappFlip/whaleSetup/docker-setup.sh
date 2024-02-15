#!/bin/bash

echo "Start installing dependencies"

npm install -g truffle
npm install -g ganache
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

echo "Installing dependencies complete"

tail -f /dev/null