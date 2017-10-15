var request = require('request');
var cloudscrapper = require('cloudscrapper');
var fs = require('fs');

var SpigotPluginManager = {
    "install": function(id, pluginPath, cb){
        var plugins = require("../configs/plugins.yml");
        var install = true;

        request("https://api.spiget.org/v2/resources/" + id, function(error, response, body){
            var plugin = JSON.parse(body);
            if(plugin[0] !== undefined){
                plugin = plugin[0];
            }
            if(plugin['external'] == false){
                for(var i in plugins){
                    var pluginEntry = plugins[i];
                    if(pluginEntry.source == "spigot" && pluginEntry.id == plugin["id"]){
                        install = false;
                        console.log("Plugin is already installed");
                        break;
                    }
                }
                if(install){
                    console.log("Installing plugin: " + plugin['name']);
                    plugins.push(
                        {
                            "source": "spigot",
                            "id": plugin["id"],
                            "name": plugin["name"],
                            "version": plugin["version"]
                        }
                    );
                }
            }
        })
    }
}