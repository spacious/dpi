
var debug = require('debug')('metalsmith-matter');
var path = require('path');
var jf = require('jsonfile');
var minimatch = require("minimatch");
var util = require('util');
var defaults = require('lodash').defaults;


/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to add front-matter properties to files via a json argument and/or file
 *
 * This plugin does not override any variables, the order of precedence is logically: (highest to lowest)
 *
 * 1. YAML front-matter
 * 2. Plugin options: `options.matter`
 * 3. JSON file
 *
 * Specifically, it just calls _.defaults() on each level.
 *
 * Keys in matter can be any minimatch-able string so it's easy to apply variables to groups of files
 *
 * @param {object|string} options
 *
 * @return {Function}
 */
function plugin(options){

    options = options || {};

    var matter = options.matter || {};
    var file = options.file || (options.matter ? null : './matter.json');
    var data = file ? jf.readFileSync(file) : {};
    matter = defaults(data,matter);

    return function metalsmith_matter(files, metalsmith, done){

        debug(util.inspect(matter));

        var keys = Object.keys(files);
        var patterns = Object.keys(matter) || [];

        setImmediate(done);

        if(!patterns.length || !keys.length){
            return;
        }

        patterns.forEach(function(pattern){

            keys.filter(minimatch.filter(pattern)).forEach(function(fk){

                files[fk] = defaults(files[fk],matter[pattern]);

            });
        });
    };
}