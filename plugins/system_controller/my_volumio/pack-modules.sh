#!/bin/sh

echo "Ensuring we are in the plugin dir"
cd /myvolumio/plugins/system_controller/my_volumio/

echo "Installing modules"
npm install

echo "Clearing unused firebase modules"
rm -rf /myvolumio/plugins/system_controller/my_volumio/node_modules/@firebase/firestore
rm -rf /myvolumio/plugins/system_controller/my_volumio/node_modules/@firebase/firestore-types
rm -rf /myvolumio/plugins/system_controller/my_volumio/node_modules/@firebase/functions
rm -rf /myvolumio/plugins/system_controller/my_volumio/node_modules/@firebase/functions-types
rm -rf /myvolumio/plugins/system_controller/my_volumio/node_modules/@firebase/messaging
rm -rf /myvolumio/plugins/system_controller/my_volumio/node_modules/@firebase/messagging-types

echo "Clearing remaining modules"
node /volumio/utils/misc/clean-node-modules.js

echo "Creating archive"
cd /
sudo tar zcf /myvolumio_modules.tar.gz /myvolumio/plugins/system_controller/my_volumio/node_modules/*

