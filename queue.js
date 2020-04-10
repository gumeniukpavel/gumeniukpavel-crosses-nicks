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
            this.queue.push(socket_id);
        }
    }

    removeFromQueue(socket_id){
        if( this.queue.indexOf(socket_id) != -1 ){
            this.queue.splice(this.queue.indexOf(socket_id), 1);
        }
    }

    findOpponents(){
        if( this.queue.length >= 2){
            var opponents = [this.queue[0], this.queue[1]];
            this.removeFromQueue(this.queue[0]);
            this.removeFromQueue(this.queue[1]);

            this.game.createGame(opponents);
        }
    }
}

module.exports = Queue;
