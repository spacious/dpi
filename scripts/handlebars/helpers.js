var debug = require('debug')('helpers');
var path = require('path');

exports.register = function(handlebars){

    handlebars.registerHelper('replace', function( string, to_replace, replacement ){
        return ( string || '' ).replace( to_replace, replacement || '' );
    });

    function relativePathHelper(current, target) {

        // normalize and remove starting slash
        current = path.normalize(current).slice(0);
        target = path.normalize(target).slice(0);

        current = path.dirname(current);
        var out = path.relative(current, target);
        return out;
    };

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

    handlebars.registerHelper('format_title', format);
    handlebars.registerHelper('relative_path', relativePathHelper);

    handlebars.registerHelper('link_icon', function(href){

        var paths = href.split('/');
        var name = icon(paths);

        return (name) ? new handlebars.SafeString('<i class="fa fa-'+name+'"></i> ') : '';
    });


};