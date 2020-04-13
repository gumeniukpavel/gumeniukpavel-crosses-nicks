var uid = require('uuid');

class Game{
    constructor(){
        this.gamesToStart = [];
        this.activeGames = [];
        this.archiveGames = [];
        this.winConditions =[
            [1,2,3], [1,4,7], [1,5,9], [2,5,8], [3,6,9], [4,5,6], [7,8,9], [3,5,7]
        ];

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
            'move':[]
        }

        console.log("creategameEndBack",game);

        this.gamesToStart.push(game);
    }

    getActiveGamesForSend(){

        console.log("getActiveGamesForSend",this.activeGames.filter( el => !el.send ));
        return this.activeGames.filter( el => !el.send );
    }

    getActiveGameById(id){
        console.log("getActiveGameById", this.activeGames.filter( el => el.id == id )[0]);

        return this.activeGames.filter( el => el.id == id )[0];
    }

    getActiveGameBySocketId(socket_id){
        var game = this.activeGames.filter( el => el.opponentOne == socket_id )[0];

        if( !game ){
            game = this.activeGames.filter( el => el.opponentTwo == socket_id )[0];
        }
        console.log("getActiveGameBySocketId", game);

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
            console.log("getActiveGamesForSend", game.id, winTeam);

            this.endGame(game.id, winTeam);
        }
    }

    startGames(){
        for (var i = 0; i < this.gamesToStart.length; i++) {
            this.gamesToStart[i].start = true;
            console.log("DOstartGames", this.activeGames);
            console.log("DOstartGames", this.gamesToStart[i]);

            this.activeGames.push(this.gamesToStart[i]);
            this.gamesToStart.splice(this.gamesToStart.indexOf(this.gamesToStart[i]), 1);

            console.log("POSLEstartGames", this.activeGames);
            console.log("POSLEstartGames", this.gamesToStart[i]);

        }
    }

    endGame(game_id, winTeam){
        var thisGame = this.getActiveGameById(game_id);

        if( thisGame ){
            thisGame.finish = true;
            thisGame.win = winTeam;

            console.log("DoendGame", this.activeGames);
            this.archiveGames.push(thisGame);
            this.activeGames.splice(this.activeGames.indexOf(thisGame), 1);
            console.log("POSLEendGame", this.activeGames);
        }
    }

    checkGame(game){

        var winTeam = false;

        this.winConditions.forEach((condition) => {
            var winBoxes = [];

            condition.forEach((value) => {
                if(game.moves[value])
                    winBoxes.push(game.moves[value]);
            })

            if(winBoxes.length == 3){
                var team = winBoxes[0];
                var winStatus = true;
                winBoxes.forEach( (value)=> {
                    if(team != value ){
                        winStatus = false;
                    }
                })
            }

        })

        return $winTeam;
    }

    move(msg){
        var game = this.getActiveGameById(msg.game_id);
        game.moves[msg.box_id].push(msg.tumbler);

        if(game.moves.length>=5){
            this.checkGame(game);
        }
        return game;
    }
}

module.exports = Game
