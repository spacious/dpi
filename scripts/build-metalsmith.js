
var path = require('path');
var util = require('util');

var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var assets = require('metalsmith-assets');
var metallic = require('metalsmith-metallic');
var permalinks = require('metalsmith-permalinks');

var handlebars = require('handlebars');
handlebars.registerHelper('replace', function( string, to_replace, replacement ){
    return ( string || '' ).replace( to_replace, replacement || '' );
});

// sets all file's metadata to have its file path set to `path`
var filePathTask = function(files, metalsmith, done){
    for(var file in files){
        files[file].fullpath = file;
    }
    done();
};

var relativePathHelper = function(current, target) {

    // normalize and remove starting slash
    current = path.normalize(current).slice(0);
    target = path.normalize(target).slice(0);

    current = path.dirname(current);
    var out = path.relative(current, target);
    return out;
};

handlebars.registerHelper('relative_path', relativePathHelper);

exports.build = function(dirname,assetsPath,cb){

    cb = cb || function(err){};

    var meta = {
        title: "IDP",
        description: "Developer Portal",
        partials: {
            header : '_header',
            footer : '_footer',
            index_button_block : '_index_button_block',
            navbar : '_navbar',
            dropdown_items : '_dropdown_items'
        }
    };

    var assetPaths = {
        source: assetsPath,     // relative to the working directory
        destination: './'       // relative to the build directory
    };

    var collectionPaths = {
        docs: 'docs/**'
    };

    var metalsmith = Metalsmith(dirname);
    metalsmith
        .clean(true)
        .metadata(meta)
        .use(metallic())
        .use(markdown())
        .use(assets(assetPaths))
        .use(permalinks({relative:false}))
        .use(filePathTask)
        .use(collections(collectionPaths))

        .use(createTrees)
        .use(templates('handlebars'))
        .build(cb);
};




function createTree(info,item){

    item = item || {};

    if(info){

        item.href = info.path;
        item.text = info.title;
        item.date = info.date || '';
        item.platform = info.platform || '';
        item.version = info.version || '';
    }

    return item;
}

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

function ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}


function createTrees(files, metalsmith, done){

    var metadata = metalsmith.metadata();

    var treeCollections = {};

    Object.keys(metadata.collections).forEach(function(key) {

        var collection = metadata.collections[key];

        if(collection) {

            var trees = {};

            for(var ci in collection) {

                if(collection[ci]) {

                    var c = collection[ci];
                    var p = c.path;
                    var paths = p.split('/');

                    var k = '';
                    var tree = null;

                    for( var i in paths ){

                        var p = paths[i];
                        k = path.join(k,p);

                        if(i == 0){

                            trees[p] = tree =  trees[p] || createTree();

                            if(paths.length == 1){

                                tree = createTree(c,tree);
                            }

                        }else{

                            if(i < paths.length - 1){

                                // not the last
                                if(!tree.children){
                                    tree.children = {};
                                }

                                tree = tree.children[p] = tree.children[p] || createTree();

                                if(i < 2){

                                    tree.text = format(p);
                                }

                            }else{

                                // the last

                                if(!tree.children){
                                    tree.children = {};
                                }

                                tree.children[p] = createTree(c);
                            }
                        }
                    }
                }
            }

            treeCollections[key] = {text:format(key),children:trees};
        }
    });

    //console.log(util.inspect(treeCollections,{'depth':10}));

    metadata.trees = treeCollections;

    done();
}