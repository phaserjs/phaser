module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['Phaser/**/*.ts'],
                dest: 'build/phaser.js',
                options: {
                    target: 'ES5'
                }
            }
        },
		copy: {
			main: {
				files: [{
					src: 'build/phaser.js',
					dest: 'Tests/phaser.js'
				}]
			},
			amd: {
				files: [{
					src: 'build/phaser.js',
					dest: 'build/phaser.amd.js'
				}],
				options: {
					processContent: function(content) {
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
					}
				}
			}
		},
		watch: {
            files: '**/*.ts',
            tasks: ['typescript', 'copy']
        }
    });

    grunt.registerTask('default', ['watch']);

}
