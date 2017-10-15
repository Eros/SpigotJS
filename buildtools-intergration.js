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
    })
}