var io=require('socket.io-client');

var socket= io.connect('http://localhost:3000');

var data={
    "endpoint":"music_service/cd_controller",
    "method":"detectCD",
    "data": {}
};

socket.emit('callMethod',data);
