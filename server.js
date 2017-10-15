var events = require('events');
var spawn = require('child_process').spawn;

var eventEmitter = new events.EventEmitter;

var server = {};

server.proc = null;

server.path = "files/MinecraftServer/";
server.FileName = "server.jar";

server.maxRam = "";//need to change this
server.minRam = "";//and this