var dbus = require ('dbus-native')
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var playingCallback = function (){}
var metadataCallback = function (){}
var progressCallback = function (){}
var volumeCallback = function (){}

var debug = true;

module.exports = {
    playingCallback: playingCallback,
    metadataCallback: metadataCallback,
    progressCallback: progressCallback,

    setCallbacks: function(playCallback, metaCallback, progreCallback, myVolumeCallback) {
        playingCallback = playCallback;
        metadataCallback = metaCallback;
        progressCallback = progreCallback;
        volumeCallback = myVolumeCallback;
    },

    start: function() {
        setup();
    },

    stop: function() {

    }
}

function setup() {
    process.env.DISPLAY = ':0';
    process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';

    // Media API https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/media-api.txt

    var conn = dbus.createConnection();
    var bus = dbus.systemBus();
    conn.message({
        type: 1,
        serial: 1,
        path: '/org/freedesktop/DBus',
        destination: 'org.freedesktop.DBus',
        interface: 'org.freedesktop.DBus',
        member: 'Hello',
    });

    conn.message({
        path: '/org/freedesktop/DBus',
        destination: 'org.freedesktop.DBus',
        interface: 'org.freedesktop.DBus',
        member: 'AddMatch',
        signature: 's',
        body: ["type='signal'"]
    });


    conn.message({
        path: '/org/freedesktop/DBus',
        destination: 'org.freedesktop.DBus',
        interface: 'org.freedesktop.DBus',
        member: 'AddMatch',
        signature: 's',
        body: ["type='method_call'"]
    });

    conn.message({
        path: '/org/freedesktop/DBus',
        destination: 'org.freedesktop.DBus',
        interface: 'org.freedesktop.DBus',
        member: 'AddMatch',
        signature: 's',
        body: ["type='method_return'"]
    });



    conn.on('message', function(msg) {

        //console.log(JSON.stringify(msg, 0, 4)); //TODO: dbus-monitor pretty-print
        if (!msg.body) {
            return;
        }

        isStatus(msg);
        isPosition(msg);
        isTrack(msg);
        isVolume(msg);

    });
}


function isBluez(msg, type) {
    //console.log(msg.body[1][0][0]);
    if (msg.body[0].indexOf(type) > -1 ) return true;
    return false;
}

function isVolume(msg) {
    try {

        if (msg.body[1][0][0] == "Volume")  {
            volumeCallback(msg.body[1][0][1][1][0]);
        }
    } catch (e) {

    }
}

function isStatus(msg) {

    try {
        if (msg.body[1] && msg.body[1][0] && msg.body[1][0][0]) {
            if (msg.body[1][0][0] == "Status" || msg.body[1][0][0] == "State") {
                var status = msg.body[1][0][1][1][0];
                log('BT STATUS: ' + status);
                playingCallback(status == "playing" || status == "active");
            }
        }
    } catch (e) {
        log('Error in parsing play status: '+ e)
    }
    return false;
}


/*
 ***0 Item: "/org/bluez/hci0/dev_70_70_0D_C4_F4_9B/player0/NowPlaying/item10305252177287135780"***
 ***1 Album: "Max Gazzè: The Best of Platinum"***
 ***2 TrackNumber: 5***
 ***3 Genre: "Pop"***
 ***4 Duration: 226162***
 ***5 NumberOfTracks: 8***
 ***6 Title: "Vento d'estate"***
 ***7 Artist: "Max Gazzè"***
 */
var title = "";
var album = "";
var artist = "";
var genre = "";
var duration = "";

function isTrack(msg) {
    try {
        if (!isBluez(msg, "org.bluez.MediaPlayer1")) return
        var dbusmeta = msg.body[1][0][1][1][0];

        var updateMeta = false;
        for (i=0; i< 10;i++) {
            try {
                switch (dbusmeta[i][0]) {
                    case "Title":
                        updateMeta = true;
                        title = dbusmeta[i][1][1][0];
                        break;

                    case "Album":
                        updateMeta = true;
                        album = dbusmeta[i][1][1][0];
                        break;

                    case "Artist":
                        updateMeta = true;
                        artist = dbusmeta[i][1][1][0];
                        break;
                    case "Duration":
                        updateMeta = true;
                        duration = dbusmeta[i][1][1][0];
                        break;
                    default:
                    //console.log("Found " + dbusmeta[i][0] + " but not using it.");
                }
            } catch (e) {}
        }
        if (updateMeta) {
            metadataCallback(title, album, genre, duration, artist);
        }

    } catch(e) {
        //console.log('Error in parsing BT Meta: '+e)
    }
}


function isPosition(msg) {
    try {

        if (msg.body[1][0][0] == "Position") progressCallback(msg.body[1][0][1][1][0], duration);
    } catch (e) {

    }
    return false;
}

function log(message) {
    if (debug) {
        console.log('------------------------------------ BT MESSAGE: ' + message)
    }
}