/**
 * Contains all settings and plugins to build with Metalsmith
 *
 * exposes one single method: build(callback(error){});
 */

var debug = require('debug')('build-metalsmith');
var path = require('path');
var util = require('util');

var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var assets = require('metalsmith-assets');
var metallic = require('metalsmith-metallic');
var permalinks = require('metalsmith-permalinks');

var aglio = require('./metalsmith/metalsmith-aglio');
var fullpath = require('./metalsmith/metalsmith-fullpath');
var metajson = require('./metalsmith/metalsmith-metajson');

var handlebars = require('handlebars');
var helpers = require('./handlebars/helpers');

// pass handlebars to register any helpers
helpers.register(handlebars);

/**
 * Main Metalsmith metadata
 *
 * @type {object}
 */
var meta = {
    title: "IDP",
    description: "Developer Portal",
    partials: {
        header : '_header',
        footer : '_footer',
        index_button_block : '_index_button_block',
        navbar : '_navbar'
    }
};

/**
 * Config for metalsmith-aglio
 * @type {object}
 */
var aglioConf = {
    template:'./scripts/convert-templates/apibp/api.jade'
};

/**
 * Config for metalsmith-assets
 * @type {object}
 */
var assetPaths = {
    source: './assets',     // relative to the working directory    (dirname)
    destination: './'       // relative to the build directory      (dirname/build)
};

/**
 * Config for metalsmith-permalinks
 * @type {object}
 */
var permaConf = {
    // relative creates copies of all assets to preserve paths for every file
    relative:false
};

/**
 * Key Value groups of files, used to group together pages for menus currently
 * @type {object}
 */
var collectionPaths = {
    index_button: '+(about|docs)/*',
    navbar_button: 'about/*',
    navbar_doc_dropdown: 'docs/**'
};

/**
 * Key Value lookup of icon words (used by fontawesome)
 * @type {object}
 */
var icons = {

    about : 'bolt',
    docs : 'file-text',
    api : 'code',
    sdk : 'code',
    ios : 'apple',
    android : 'android'
};

// we may move to jade
var templateEngine = 'handlebars';

/**
 * Expose the `build` method
 * @param cb
 */
exports.build = function(cb){

    var dirname = path.join(__dirname,'../.');
    cb = cb || function(err){};

    var metalsmith = Metalsmith(dirname);
    metalsmith
        .clean(true)
        .metadata(meta)
        .use(metajson())
        .use(aglio(aglioConf))
        .use(metallic())
        .use(markdown())
        .use(assets(assetPaths))
        .use(permalinks(permaConf))
        .use(fullpath())
        .use(collections(collectionPaths))
        .use(collectionSections)
        .use(templates(templateEngine))
        .build(cb);
};

/**
 * Looks up an icon by key or array (useful for paths)
 *
 * @param key
 * @returns {*}
 */
function icon(key){

    if(key.constructor === Array && key.length){

        return key.reduce(function(p,v){

            return icon(v) || p;

        },key[0]);


    }else if(key.constructor === String && icons[key]){

        return icons[key];
    }

    return null;
}

/**
 * Temporary text formatting
 *
 * @param str
 * @returns {*}
 */
function format(str){

    str = str.toLowerCase();

    var uc = ['api','sdk'];
    if(uc.indexOf(str) > -1){
        return str.toUpperCase();
    }

    if(str == 'ios'){
        return 'iOS';
    }

    return ucwords(str);
}

/**
 * Capitalize the first letter of each word
 *
 * @param str
 * @returns {*|string}
 */
function ucwords (str) {

    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}

/**
 * Sort collections by path (used by collectionSections)
 * @param a
 * @param b
 * @returns {number}
 */
function sortCollectionPaths(a,b) {

    if (a.path < b.path){
        return -1;
    }

    if (a.path > b.path){
        return 1;
    }

    return 0;
}

/**
 * Metalsmith plugin function to create a hierarchical list from collections
 *
 * Used by templates
 *
 * __Could be moved to a plugin with configurable options__
 *
 * @param files
 * @param metalsmith
 * @param done
 */
function collectionSections(files, metalsmith, done){

    var metadata = metalsmith.metadata();

    var lists = {};

    setImmediate(done);

    Object.keys(metadata.collections).forEach(function(key) {

        var collection = metadata.collections[key];

        if(collection && collection.length) {

            collection.sort(sortCollectionPaths);

            var list = {
                title: null,
                items : [],
                sections : {}
            };

            for(var c in collection) {

                if(collection[c]) {

                    var item = collection[c];

                    if(item.path){

                        var paths = item.path.split('/');

                        if(paths.length && !list.title){
                            list.title = format(paths[0]);
                        }

                        if(paths.length > 1){
                            // section at level 2
                            var p = paths[1];
                            if(!list.sections[p]){
                                list.sections[p] = {
                                    title: format(p),
                                    items : []
                                };
                            }
                        }

                        var items = (paths.length == 1) ? list.items : list.sections[p].items;

                        var title = (item[key] && item[key].title ? item[key].title : item.title) || '';

                        items.push({path:item.path,title:title,icon:icon(paths) || ''});
                    }
                }
            }

            lists[key] = list;
        }
    });

    //debug(util.inspect(lists,{'depth':10}));

    metadata.lists = lists;
}