/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to hide files that have a truthy value for key (ie `hide:true`)
 *
 * This plugin is an exact copy of metalsmith-drafts except it allows you to set the key, so...
 *
 *  metalsmith-drafts() = metalsmith-hide('draft') || metalsmith-hide({key:'draft'})
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
        options = { key: options };
    }
    var key = options.key || 'hide';

    return function(files, metalsmith, done){
        setImmediate(done);
        Object.keys(files).forEach(function(file){
            var data = files[file];
            if (data[key]) delete files[file];
        });
    };
}