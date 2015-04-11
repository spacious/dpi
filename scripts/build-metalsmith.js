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
var filepath = require('metalsmith-filepath');

var aglio = require('./metalsmith/metalsmith-aglio');
var matter = require('./metalsmith/metalsmith-matter');
var hide = require('./metalsmith/metalsmith-hide');
var versions = require('./metalsmith/metalsmith-versions');
var lists = require('./metalsmith/metalsmith-lists');

// Handlebars
var handlebars = require('handlebars');
var helpers = require('./handlebars/helpers');
// pass handlebars to register any helpers
helpers.register(handlebars);

/**
 * Config for metalsmith
 * @type {object}
 */
var config = {

    meta : {
        title: "IDP",
        description: "Developer Portal",
        partials: {
            header : '_header',
            footer : '_footer',
            index_button_block : '_index_button_block',
            navbar : '_navbar'
        }
    },

    aglio : {
        template:'./scripts/templates/apibp/api.jade'
    },

    versions : {

        "files" : [
            "docs/**"
        ],
        "latest" : "index"
    },

    assets : {
        source: './assets',     // relative to the working directory    (dirname)
        destination: './'       // relative to the build directory      (dirname/build)
    },

    permalinks : {
        // relative creates copies of all assets to preserve paths for every file
        relative:false
    },

    filepath : {
        // removes / from beginning of path (`link`)
        absolute:false
    },

    collections : {

        index_button: '+(about|docs)/*',
        navbar_button: 'about/*',
        navbar_doc_dropdown: 'docs/**'
    },

    templates : 'handlebars'
};

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
        .metadata(config.meta)
        .use(matter())
        .use(hide())
        .use(versions(config.versions))
        .use(aglio(config.aglio))
        .use(metallic())
        .use(markdown())
        .use(assets(config.assets))
        .use(permalinks(config.permalinks))
        .use(filepath(config.filepath))
        .use(collections(config.collections))
        .use(lists())
        .use(templates(config.templates))
        .build(cb);
};