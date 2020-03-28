#!/bin/bash

CDDRIVE='/dev/sr0'

function permission {
#echo "Applying Permissions"
/usr/bin/sudo /bin/chmod 777 $CDDRIVE
#/usr/bin/sudo /bin/chmod -R 777 /home/volumio/
}

function startcdde {
#echo "Starting CDDE"
/usr/bin/cdde -r -c /volumio/app/plugins/music_service/cd_controller/cdde.xml
}


permission

