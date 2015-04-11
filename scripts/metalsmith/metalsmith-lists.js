/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to create a hierarchical list from collections
 * Used by templates
 *
 * TODO: abstract hard-coded logic into options, do not publish
 *
 * @param {object|string} options
 *
 * @return {Function}
 */
function plugin(options){

    return function metalsmith_lists(files, metalsmith, done){

        var metadata = metalsmith.metadata();

        var lists = {};

        var sortCollectionPaths = buildSorter('path',false);
        var sortItemVersions = buildSorter('version',true);

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
                                //                            list.title = format(paths[0]);
                                list.title = paths[0];
                            }

                            if(paths.length > 1){
                                // section at level 2
                                var p = paths[1];
                                if(!list.sections[p]){
                                    list.sections[p] = {
                                        //title: format(p),
                                        title: p,
                                        items : []
                                    };
                                }
                            }

                            var items = (paths.length == 1) ? list.items : list.sections[p].items;

                            // override title in front matter
                            var title = (item[key] && item[key].title ? item[key].title : item.title) || '';
                            var hide = false;
                            // hide latest from versions
                            if(item.latest){ hide = true; }

                            if(!hide){

                                items.push({path:item.path,title:title,version:item.version||''});
                            }
                        }
                    }
                }

                sortListItems(list,sortItemVersions);

                lists[key] = list;
            }
        });

        //debug(util.inspect(lists,{'depth':10}));

        metadata.lists = lists;
    }
}

function sortListItems(list,sorter){

    if(list.items){
        list.items.sort(sorter);
    }

    if(list.sections){

        Object.keys(list.sections).forEach(function(s){

            sortListItems(list.sections[s],sorter);
        });
    }
}

function buildSorter(key,desc){

    var v = desc ? -1 : 1;

    return function sorter(a,b){

        return a[key] > b[key] ? v : (a[key] < b[key] ? -v : 0);
    }
}