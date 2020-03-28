#!/bin/bash

read -p "Make sure you've logged out from User Interface, Press enter to continue"


echo "Switching to Production MyVolumio Environment"

echo '{
  "username":{
    "type": "string",
    "value":""
  },
  "password":{
    "type":"string",
    "value":""
  },
  "token":{
    "type":"string",
    "value":""
  },
  "tunnel_type":{
    "type":"string",
    "value":"1"
  },
  "environment":{
    "type":"string",
    "value":"development"
  },
  "overrideGeo": {
    "type": "string",
    "value": "none"
  }
}' > /data/configuration/system_controller/my_volumio/config.json

echo "Restarting"
killall node
