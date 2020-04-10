var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

class Socket{
    constructor(){
        this.io = io;
    }
}

module.exports = Socket;
