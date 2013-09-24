module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    var wrapPhaserInUmd = function(content, isAddon) {
        var replacement = [
            '(function (root, factory) {',
            '    if (typeof exports === \'object\') {',
            '        module.exports = factory();',
            '    } else if (typeof define === \'function\' && define.amd) {',
            '        define(factory);',
            '    } else {',
            '        root.Phaser = factory();',
            '  }',
            '}(this, function () {',
            content,
            'return Phaser;',
            '}));'
        ];
        return replacement.join('\n');
    };

    var wrapAddonInUmd = function(content) {
        var replacement = [
            '(function (root, factory) {',
            '    if (typeof exports === \'object\') {',
            '        module.exports = factory(require(\'phaser\'));',
            '    } else if (typeof define === \'function\' && define.amd) {',
            '        define([\'phaser\'], factory);',
            '    } else {',
            '        factory(root.Phaser);',
            '  }',
            '}(this, function (Phaser) {',
            content,
            'return Phaser;',
            '}));'
        ];
        return replacement.join('\n');
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['Phaser/**/*.ts'],
                dest: 'build/phaser.js',
                options: {
                    target: 'ES5',
                    declaration: true,
                    comments: true
                }
            },
        },
        copy: {
            main: {
                files: [{
                    src: 'build/phaser.js',
                    dest: 'Tests/phaser.js'
                }]
            },
            mainAmd: {
                files: [{
                    src: 'build/phaser.js',
                    dest: 'build/phaser.amd.js'
                }],
                options: {
                    processContent: wrapPhaserInUmd
                }
            },
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'src/',
                    themedir: 'Docs/yuidoc-theme-dana/',
                    outdir: 'Docs/API/'
                }
            }
        },

        watch: {
            files: '**/*.ts',
            tasks: ['typescript', 'copy']
        }
    });

    grunt.registerTask('default', ['typescript', 'copy', 'watch']);

}
