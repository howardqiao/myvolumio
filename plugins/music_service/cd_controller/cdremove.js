var io=require('socket.io-client');
var exec = require('child_process').exec;
var socket= io.connect('http://localhost:3000');

var data={
    "endpoint":"music_service/cd_controller",
    "method":"removeCD",
    "data": {}
};

socket.emit('callMethod',data);

exec("/usr/bin/mpc", {cwd:'/home/volumio',uid: 1000, gid: 1000}, function(error, stdout, stderr) {
    if (error !== null) {
        self.logger.info('Cannot exec mpc ' +error)
    } else {
        var lines = stdout.toString().split("\n");
        var current =lines[0];
        if (current.indexOf('cdda:///') >= 0) {
            exec("/usr/bin/mpc stop && /usr/bin/mpc clear", {cwd:'/home/volumio',uid: 1000, gid: 1000}, function(error, stdout, stderr) {
                if (error !== null) {
                    self.logger.info('Cannot exec mpc ' +error)
                } else {
                    var asd={
                        "endpoint":"music_service/mpd",
                        "method":"updateQueue",
                        "data": {}
                    };
                    socket.emit('callMethod',asd);
                    socket.emit('clearQueue','');


                    console.log('Clened CD upon ejection')
                }
            });

        }
    }
});
