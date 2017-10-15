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
    })
    }
}