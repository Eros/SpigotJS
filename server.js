var events = require('events');
var spawn = require('child_process').spawn;

var eventEmitter = new events.EventEmitter;

var server = {};

server.proc = null;

server.path = "files/MinecraftServer/";
server.FileName = "server.jar";

server.maxRam = "";//need to change this
server.minRam = "";//and this

server.worldsDir = "../worlds/";
server.pluginsDir = "../plugins/";
server.configDir = "../settings/";

server.start = function(cb){
    if(server.proc == null){
        server.proc = spawn('java',
    [
        "-Dcom.mojang.eula.agree=true",
        "-Xms" + server.minRam,
        "-Xmx" + server.maxRam,
        "-jar", server.FileName,
        "--world-dir", server.worldsDir,
        "--plugins", server.pluginsDir,
        "--bukkit-settings", server.configDir + "bukkit.yml",
        "--command-settings", server.configDir + "commands.yml",
        "--config", server.configDir + "config.yml",
        "--spigot-settings", server.configDir + "spigot.yml"
    ],{
        cwd : server.path
    });

    server.proc.on('exit', function(){
        server.proc = null;
        eventEmitter.emit('stop');
    });

    eventEmitter.emit('start');
    } else {
        console.log("Server is running");
    }
    if(cb !== undefined)
        cb();
};
    server.stop = function(cb){
        if(server.proc !== null){
            server.proc.stdin.write('stop\n');
            if(cb !== undefined){
                eventEmitter.once("stop", function(){
                    server.proc = null;
                });
                eventEmitter.once("stop", cb);
            }
        } else {
            console.log("Server is not running");
            if(cb !== undefined)
                cb();
        }
    };
server.on = function(event, callback){
    eventEmitter.o(event, callback);
};
server.once = function(event, callback){
 eventEmitter.once(event, callback);
};

server.onLog = function(cmd){
    if(server.proc !== null){
        server.proc.stdin.write(cmd + "\n");
    } else {
        console.log("Server is not running");
    }
};

module.exports = server;