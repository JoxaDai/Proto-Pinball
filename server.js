const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 1300;

app.use(express.static(__dirname + '/public'));
io.on('connection', onConnection);
http.listen(port, () => console.log('listening on port ' + port));

const numRooms = 5;
const maxPeople = 4;