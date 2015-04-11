var debug = require('debug')('metalsmith-versions');
var multimatch = require('multimatch');

var join = require('path').join;
var dirname = require('path').dirname;
var basename = require('path').basename;
var extname = require('path').extname;
var copy = require('shallow-copy');

/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to rename paths based on version
 *
 * @param {object|string} options
 *
 * @return {Function}
 */
function plugin(options){

    options = options || {};

    var patterns = options.files || [];
    var versionKey = options.key || 'version';

    var sorter = buildSorter(versionKey,true);
    var latest = (options.latest && ('string' == typeof options.latest)) ? options.latest : null;

    return function metalsmith_versions(files, metalsmith, done){

        setImmediate(done);

        var keys = (patterns.length) ? multimatch(Object.keys(files),patterns) : Object.keys(files);

        if(!keys.length){ return; }

        var paths = {};

        // TODO: Guard against dupe versions (using mtime, hide, etc)
        // ,"mtime":data.stats.mtime

        keys.forEach(function(file){

            var data = files[file];

            if(data[versionKey]){

                var ver = data[versionKey];
                var dir = dirname(file);

                paths[dir] = paths[dir] || [];
                paths[dir].push({"path":file,"version":ver});
            }
        });

        Object.keys(paths).forEach(function(dir){

            var versions = paths[dir];

            if(latest){
                versions.sort(sorter);
            }

            versions.forEach(function(v,i){

                var originalFilePath = v.path;
                var extension = extname(originalFilePath);
                var data = files[originalFilePath];

                // ../path/1.0.md
                var versionFilePath = join(dir,v.version+extension);

                if(i == 0 && latest){

                    // latest

                    var latestFilePath = join(dir,latest+extension);

                    // Create latest path with shallow copy of original data
                    files[latestFilePath] = copy(data);

                    // Create version path with original data
                    data.latest = true;
                    files[versionFilePath] = data;

                }else{

                    // Not the latest or no latest name defined
                    // Create version path with original data
                    files[versionFilePath] = data;
                }

                // Remove original path from files
                delete files[originalFilePath];
            });
        });
    };
}

function buildSorter(key,desc){

    var v = desc ? -1 : 1;

    return function sorter(a,b){

        return a[key] > b[key] ? v : (a[key] < b[key] ? -v : 0);
    }
}