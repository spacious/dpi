
var aglio = require('aglio');
var basename = require('path').basename;
var debug = require('debug')('metalsmith-aglio');
var dirname = require('path').dirname;
var extname = require('path').extname;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert api-blueprint markdown files using aglio
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */
function plugin(options){

    options = options || {};

    var template = options.template || 'default';

    return function(files, metalsmith, done){

        setImmediate(done);

        Object.keys(files).forEach(function(file){

            debug('checking file: %s', file);

            var data = files[file];

            if(file == 'docs/api/ice/v1.md'){

                debug(data);
            }

            if (!apiBlueprint(data)){
                return;
            }

            var dir = dirname(file);
            var html = basename(file, extname(file)) + '.html';
            if ('.' != dir) html = dir + '/' + html;

            debug('converting file: %s', file);

//            var blueprint = data.contents.toString();
//
//            aglio.render(blueprint, template, function(err, out, warnings) {
//
//                if (err) return console.log(err);
//
//                if (warnings) console.log(warnings);
//
//                debug('converted file: %s -> %s', file, html);
//
//                delete files[file];
//                files[html] = data;
//            });
        });
    };
}

/**
 * Check file data for `format`
 *
 * @param data
 * @returns boolean
 */
function apiBlueprint(data){

    return (data.format && data.format == 'api-blueprint');
}
