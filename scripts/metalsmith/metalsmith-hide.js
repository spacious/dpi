/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to hide files that have a truthy value for one or more keys (ie `hide:true`)
 *
 * This plugin is an exact copy of metalsmith-drafts except it allows you to set the keys, so...
 *
 *  metalsmith-drafts() = metalsmith-hide('draft') || metalsmith-hide(['draft']) || metalsmith-hide({keys:['draft']})
 *
 * @see https://github.com/segmentio/metalsmith-drafts
 *
 * @param {object|string} options
 *
 * @return {Function}
 */
function plugin(options){

    options = options || {};

    if ('string' == typeof options) {
        options = [options];
    }
    if ('array' == typeof options) {
        options = { keys: options };
    }

    var keys = options.keys || ['hide','draft'];

    return function metalsmith_hide(files, metalsmith, done){

        setImmediate(done);

        Object.keys(files).forEach(function(file){

            var data = files[file];

            if(keys.some(function(key){return (data[key]);})){

                delete files[file];
            }
        });
    };
}