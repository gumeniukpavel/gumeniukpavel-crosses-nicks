var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var path = require('path');
var gameClass = require('./game');
var queueClass = require('./queue');
game = new gameClass();
game.start();

var queue = new queueClass(game);
queue.start();

var connections = [];

io.on('connection', function(socket){
    let activeGames;

    setInterval(() => {
        activeGames = game.getActiveGamesForSend();

        for (var i = 0; i < activeGames.length; i++) {
            io.to(activeGames[i].opponentOne).emit('gameStarted', activeGames[i]);
            io.to(activeGames[i].opponentTwo).emit('gameStarted', activeGames[i]);

            activeGames[i].send = true;
        }
    }, 10000);

    connections.push(socket.id);

    var time = (new Date).toLocaleTimeString();
	socket.json.send({'event': 'connected', 'name': socket.id, 'time': time});

    socket.on('gameEnd', function(msg){
        game.endGame(msg.game_id, msg.winTeam);
    })

    socket.on('move', function(msg){
        thisGame = game.getActiveGameById(msg.game_id);
        let allowedSocketId,
            data;

        if( thisGame.opponentOne == msg.socket_id ){
            allowedSocketId = thisGame.opponentTwo;
        }else{
            allowedSocketId = thisGame.opponentOne;
        }

        data = {'data': msg, 'allowedSocketId': allowedSocketId};

        io.to(thisGame.opponentOne).emit('moveAnswer', data);
        io.to(thisGame.opponentTwo).emit('moveAnswer', data);
    })

    socket.on('joinToQueue', function(msg){
        queue.joinToQueue(msg.socket_id);
    })

    socket.on('disconnect', function(){
      connections.splice(connections.indexOf(socket.id), 1);
      queue.removeFromQueue(socket.id);
      game.leaveFromGame(socket.id);
      console.log('user disconnected', socket.id);
    });
});

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/views/test.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
