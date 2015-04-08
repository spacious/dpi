
var mkdirp = require('mkdirp');
var aglio = require('aglio');
var filewalker = require('filewalker');
var jf = require('jsonfile');
var path = require('path');
var chalk = require('chalk');

exports.convert = function(dirname,templatePath,outPath){

    var template = path.join(templatePath,'apibp/api.jade');

    filewalker(dirname)
        .on('dir', function(p) {

            console.log(chalk.blue('dir:  %s'), p);
        })
        .on('file', function(p, s) {

            console.log(chalk.blue('file: %s, %d bytes'), p, s.size);

            if(path.basename(p) == 'dpi.json'){

                var jsonFile = path.join(dirname,p);

                jf.readFile(jsonFile, function(err, obj) {

                    if(obj && !err){

                        if(obj.file && obj.format && obj.type && obj.name && obj.version ){

                            if(obj.format == 'api-blueprint'){

                                var docFile = path.join(path.dirname(jsonFile),obj.file);

                                console.log(chalk.green("Parsing %s"),docFile);

                                var options = {
                                    template: template,
                                    locals: {
                                        api_version : obj.version
                                     }
                                };

                                var outDir = path.join(outPath,obj.type,obj.name.toLowerCase());

                                console.log(chalk.magenta("Creating %s"),outDir);

                                mkdirp.sync(outDir);

                                var outFile = path.join(outDir,'v'+obj.version+'.html');

                                console.log(chalk.magenta("Creating %s"),outFile);

                                aglio.renderFile(docFile, outFile, options, function (err, warnings) {

                                    if (err) throw err;

                                    if (warnings){

                                        console.log('Warnings:',Object.keys(warnings));
                                    }
                                });
                            }
                        }
                    }
                });
            }
        })
        .on('error', function(err) {

            if (err) throw err;
        })
        .on('done', function() {

            console.log(chalk.green('%d dirs, %d files, %d bytes'), this.dirs, this.files, this.bytes);
        })
        .walk();
};