/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to add full path of file to file object
 *
 * full path includes filename which is omitted  by metalsmith-permalinks' `path`)
 *
 * useful for calculating relative paths, found somewhere on the internet
 *
 * @param {object|string} options - if string, used as property name- if object, use `key` (defaults to fullpath)
 *
 * @return {Function}
 */
function plugin(options){

    options = options || {};
    if ('string' == typeof options) options = { key: options };

    var key = options.key || 'fullpath';

    return function(files, metalsmith, done){
        for(var file in files){
            files[file][key] = file;
        }
        done();
    };
}