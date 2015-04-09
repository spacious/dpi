var jf = require('jsonfile');
var debug = require('debug')('metalsmith-metajson');
var path = require('path');
var util = require('util');
var defaults = require('lodash').defaults;
var minimatch = require("minimatch");

/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin
 *
 * @param {object|string} options
 *
 * @return {Function}
 */
function plugin(options){

    options = options || {};

    var meta = options.meta || {};
    var file = options.file || (options.meta ? null : './meta.json');
    var data = file ? jf.readFileSync(file) : {};
    meta = defaults(data,meta);

    return function metalsmith_metajson(files, metalsmith, done){

        debug(util.inspect(meta));

        var filekeys = Object.keys(files);
        var filemeta = meta.files || {};
        var patterns = Object.keys(meta.files) || [];

        if(!patterns.length || !filekeys.length){
            return done();
        }

        setImmediate(done);

        patterns.forEach(function(pattern){

            filekeys.filter(minimatch.filter(pattern)).forEach(function(fk){

                files[fk] = defaults(files[fk],filemeta[pattern]);

            });
        });
    };
}