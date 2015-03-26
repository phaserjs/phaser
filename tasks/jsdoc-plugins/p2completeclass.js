/**
* Add Phaser.Physics.P2 before the class name  in the p2.js file
*/
var path = require('path');

exports.handlers = {};
exports.handlers.newDoclet = function (e) {
    var doclet = e.doclet;

    if ((doclet.meta.filename === "p2.js") && (doclet.kind === 'class' || doclet.kind === 'interface'))
    {
        doclet.longname = "Phaser.Physics.P2." + doclet.longname;
    }
};