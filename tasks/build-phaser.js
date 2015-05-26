/**
* Compiles a custom build of Phaser from a desired set of modules.
*/

'use strict';


module.exports = function (grunt) {


    grunt.registerMultiTask('build-phaser', 'Build a custom version of Phaser', function () {

        // Initialize options, with default values.
        var options = this.options({
            filename: 'phaser',
            sourcemap: true,
            excludes: [ 'ninja', 'creature' ],
            copy: true,
            copyCustom: false
        });

        // Extract options as local variables.
        var filename   = options.filename;
        var sourcemap  = options.sourcemap;
        var excludes   = options.excludes;
        var copy       = options.copy;
        var copyCustom = options.copyCustom;

    });

};
