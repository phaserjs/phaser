exports.handlers = {
    beforeParse: function(e) {

        // replace {?[type]} with {?any}
        e.source = e.source.replace(/{\?\[type\]}/g, '{any}');

        // replace {[type]} with {any}
        e.source = e.source.replace(/{\[type\]}/g, '{any}');

    }
};