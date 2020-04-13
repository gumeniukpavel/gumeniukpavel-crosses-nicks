class Queue{
    constructor(game){
        this.queue = [];
        this.game = game;
    }

    start(){
        setInterval(() => {
          this.findOpponents();
      }, 10000);
    }

    joinToQueue(socket_id){
        if( this.queue.indexOf(socket_id) == -1 ){
            console.log("joinToQueue", socket_id);

            this.queue.push(socket_id);
        }
    }

    removeFromQueue(socket_id){
        if( this.queue.indexOf(socket_id) != -1 ){
            console.log("removeFromQueue", socket_id);
            this.queue.splice(this.queue.indexOf(socket_id), 1);
        }
    }

    findOpponents(){
        if( this.queue.length >= 2){
            var opponents = [this.queue[0], this.queue[1]];

            console.log("DofindOpponents", this.queue);
            console.log("findOpponents", opponents[0]);
            console.log("findOpponents", opponents[1]);
            this.removeFromQueue(opponents[0]);
            this.removeFromQueue(opponents[1]);
            console.log("POSLEfindOpponents", this.queue);

            this.game.createGame(opponents);
        }
    }
}

module.exports = Queue;
