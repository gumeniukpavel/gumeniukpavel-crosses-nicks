var uid = require('uuid');

class Game{
    constructor(){
        this.gamesToStart = [];
        this.activeGames = [];
        this.archiveGames = [];
    }

    start(){
        setInterval(() => {
          this.startGames();
      }, 2000);
    }

    createGame(opponents){
        var game = {
            'id': uid.v4(),
            'opponentOne': opponents[0],
            'opponentTwo': opponents[1],
            'start': false,
            'finish': false,
            'send': false,
            'win': undefined,
        }

        this.gamesToStart.push(game);
    }

    getActiveGamesForSend(){
        return this.activeGames.filter( el => !el.send );
    }

    getActiveGameById(id){
        return this.activeGames.filter( el => el.id == id )[0];
    }

    getActiveGameBySocketId(socket_id){
        var game = this.activeGames.filter( el => el.opponentOne == socket_id )[0];

        if( !game ){
            game = this.activeGames.filter( el => el.opponentTwo == socket_id )[0];
        }

        return game;
    }

    leaveFromGame(socket_id){
        var game = this.getActiveGameBySocketId(socket_id);
        let winTeam;

        if( game ){
            if( socket_id == game.opponentOne ){
                winTeam = 2;
            }else{
                winTeam = 1;
            }

            this.endGame(game.id, winTeam);
        }
    }

    startGames(){
        for (var i = 0; i < this.gamesToStart.length; i++) {
            this.gamesToStart[i].start = true;

            this.activeGames.push(this.gamesToStart[i]);
            this.gamesToStart.splice(this.gamesToStart.indexOf(this.gamesToStart[i]), 1);
        }
    }

    endGame(game_id, winTeam){
        var thisGame = this.getActiveGameById(game_id);

        if( thisGame ){
            thisGame.finish = true;
            thisGame.win = winTeam;

            this.archiveGames.push(thisGame);
            this.activeGames.splice(this.activeGames.indexOf(thisGame), 1);
        }
    }
}

module.exports = Game
