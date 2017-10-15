var request = require('request');
var fs = require('fs');
var async = require('async');

var buildtools = {};

buildtools.download = function(cwd, filename, cb){
    request('https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar', cb).pipe
    (fs.createWriteStream(cwd+filename))
};

buildtools.compile = function(cwd, filename, version, cb){
    var BTP = spawn('java', [
        '-jar', filename,
        '--rev', version
    ], {
        cwd: cwd
    });

    BTP.stdout.on('data', function(data){
        var log = data.toString().replace("\n", "");
        if(log.indexOf("WARN") > -1)
            log = log.warn;
        console.log("BuildTools-ISSUE ".BTP, log);
    });

    BTP.stderr.on('data', function(data){
        console.error("BuildTools-ISSUE".BTP, data.toString().replace("\n", "").error);
    });
    BTP.on('exit', cb);
};

buildtools.run = function(cb){
    async.series([
        function(callback){
            console.log("Downloading latest version of buildtools".notifications);
            buildtools.download(config.buildtools.path, config.buildtools.filename, function(){
                console.log("BuildTools has been downloaded");
                callback();
            });
        },

        function (callback){
            buildtools.compile(config.buildtools.path, config.buildtools.filename, "latest", function(){
                console.log("Server has compiled the build tools".notifications);

                fs.readdir(config.buildtools.path, function(err, files){
                    var fn = files.find(function(element){
                        return element.indexOf("spigot") !== -1;
                    });
                    fs.createReadStream(config.buildtools.path + filename).pipe(fs.createWriteStream(config.minecraftserv.path + config.minecraftserv.filename));
                    console.log();
                    callback();
                });
            }
    ], cb);
}