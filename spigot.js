var request = require('request');
var cloudscrapper = require('cloudscrapper');
var fs = require('fs');

var SpigotPluginManager = {
    "install": function(id, pluginPath, cb){
        var plugins = require("../configs/plugins.json");
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
                    fs.writeFile(__dirname + "/../configs/plugins.json", JSON.stringify(plugins), function(err){
                        if(err){
                            cb();
                            return console.log(err);
                        }
                        console.log("Plugin added to plugin list");
                        SpigotPluginManager.download(id, pluginPath, cb);
                    });
                }
            } else {
                if(plugin["name"] == undefined){
                    console.log("Plugin not found");
                } else {
                    console.log(plugin["name"] + "Can't be downloaded (external source)");
                }
                cb(true);
            }
        });
    },
    "download": function(id, pluginPath, cb){
        request("https://api.spigot.org/v2/resources" + id, function(err, response, body){
            var plugin = JSON.parse(body);
            if(plugin[0] !== undefined){
                plugin = plugin[0];
            }
            var pluginList = require("../configs/plugins.json");
            for(var i in pluginList){
                var pluginEntry = pluginList[i];
                if(pluginEntry.source == "spigot" && pluginEntry.id == plugin["id"]){
                    if(plugin.version.id !== pluginEntry.version){
                        console.log("Update found for plugin: " + plugin["name"]);
                    } else {
                        console.log("No update found for plugin: " + plugin["name"]);
                        cb();
                        return false;
                    }
                    pluginList[i].version = plugin.version.id;
                    break;
                }
            }
        })
    }
}