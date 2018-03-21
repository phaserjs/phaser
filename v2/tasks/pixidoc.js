/**
* Generates the appropriate JSDoc from some (PIXI) YUIDoc.
* This could be turned into a more general pacakge.
*
* Requires: yuidocjs
*/
'use strict';

function generateYuiDoc (sourcePaths, grunt) {

    var Y = require('yuidocjs');

    var options = {
        parseOnly: true,
        quiet: true,
        paths: sourcePaths
    };

    return (new Y.YUIDoc(options)).run();
}

module.exports = function (grunt) {

  grunt.registerTask('pixidoc', 'Generates JSDoc from the PIXI YUIdocs', function () {

      var sources = ['src/pixi'];
      var output = 'docs/pixi-jsdoc.js';

      var yui2jsdoc = require('./yuidoc-to-jsdoc/converter');
      var fs = require('fs');
      var path = require('path');

      // Right now yuidocsjs requires an absolute path so it emits an
      // absolute path in the jsdoc (or the JSDoc will error on missing files)
      sources = sources.map(function (source) {
        return path.resolve(source);
      });

      var data = generateYuiDoc(sources);

      if (!data) {
          grunt.fail.warn("PIXI YUIDoc not generated - nothing to do");
          return;
      }

      // Fake in namespace (current limitation)
      // A preamble/warning wrt the YUIDoc-to-JSDoc with proper link-outs could
      // also be added here.
      var header =
        "/**\n" +
        "* @namespace PIXI\n" +
        "*/";

      var comments = yui2jsdoc.convert(data);
      comments.unshift(header);
      fs.writeFileSync(output, comments.join("\n"));

  });

};
