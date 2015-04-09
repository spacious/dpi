
var aglio = require('aglio');
var chalk = require('chalk');
var basename = require('path').basename;
var debug = require('debug')('metalsmith-aglio');
var dirname = require('path').dirname;
var extname = require('path').extname;
var util = require('util');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert api-blueprint markdown files using aglio (https://github.com/danielgtaylor/aglio)
 *
 * An almost exact copy of the most copied Metalsmith plugin "metalsmith-markdown":
 * @see https://github.com/segmentio/metalsmith-markdown
 *
 * Files are converted synchronously
 *
 * Accepts same options as aglio.render:
 * @see https://github.com/danielgtaylor/aglio#agliorender-blueprint-options-callback
 *
 * @param {Object} options (optional)
 * @return {Function}
 */
function plugin(options){

    options = options || {};

    options.template = options.template || 'default';

    debug(options);

    return function(files, metalsmith, done){

        Object.keys(files).forEach(function(file){

            debug('checking file: %s', file);

            if (!apib(file)) return;

            var data = files[file];
            var dir = dirname(file);
            var html = basename(file, extname(file)) + '.html';
            if ('.' != dir) html = dir + '/' + html;

            debug('converting file: %s', file);

            var blueprint = data.contents.toString();

            var hasRunOnce = false;

            aglio.render(blueprint, options, function(err, out, warnings) {

                hasRunOnce = true;

                if (err) {
                    throw err;
                }

                var warningCount = Object.keys(warnings).length;
                if(warningCount > 1 || (warningCount == 1 && !warnings.hasOwnProperty('input'))){

                    console.log(chalk.bold.yellow('WARNINGS when converting %s -> %s:'),file, html);
                    console.log(util.inspect(warnings,5));
                }

                debug('converted file: %s -> %s', file, html);

                data.contents = new Buffer(out);

                delete files[file];
                files[html] = data;
            });

            while(!hasRunOnce) {

                require('deasync').runLoopOnce();
            }
        });

        done();
    };
}

/**
 * Check if a `file` is api-blueprint.
 *
 * @param file
 * @returns boolean
 */
function apib(file){

    return /\.apib/.test(extname(file));
}
