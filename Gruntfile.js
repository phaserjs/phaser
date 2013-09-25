var files = require('./files');

module.exports = function (grunt) {

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadTasks('lib/grunt');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      examples: {
        options: {
          base: 'out/examples',
          keepalive: true
        }
      }
    },
    concat: {
      phaser: {
        files: {
          'build/phaser.js': files.phaser,
        }
      }
    },
    process: {
      phaser: {
        files: {
          'build/phaser.js': 'build/phaser.js'
        }
      }
    },
    uglify: {
      phaser: {
        options: {
          report: 'min'
        },
        files: {
          'build/phaser.min.js': 'build/phaser.js'
        }
      }
    },
    clean: {
      phaser: {
        src: ['build/phaser.js', 'build/phaser.min.js']
      },
      examples: {
        src: ['out/examples/']
      }
    },
    copy: {
      examples: {
        files: [
          {expand: true, cwd: 'examples/assets/', src: ['**'], dest: 'out/examples/assets/'},
          {expand: true, cwd: 'build/', src: ['phaser.js'], dest: 'out/examples/assets/'}
        ]
      }
    },
    assemble: {
      options: {
        layout: 'default.hbs',
        layoutdir: 'build/layouts'
      },
      examples: {
        options: {
          assets: 'out/examples/assets',
          layout: 'example.hbs'
        },
        files: [
          {expand: true, cwd: 'examples/animation', src: ['*.hbs'], dest: 'out/examples/animation'},
          {expand: true, cwd: 'examples/audio', src: ['*.hbs'], dest: 'out/examples/audio'},
          {expand: true, cwd: 'examples/buttons', src: ['*.hbs'], dest: 'out/examples/buttons'},
          {expand: true, cwd: 'examples/camera', src: ['*.hbs'], dest: 'out/examples/camera'},
          {expand: true, cwd: 'examples/collision', src: ['*.hbs'], dest: 'out/examples/collision'},
          {expand: true, cwd: 'examples/display', src: ['*.hbs'], dest: 'out/examples/display'},
          {expand: true, cwd: 'examples/games', src: ['*.hbs'], dest: 'out/examples/games'},
          {expand: true, cwd: 'examples/input', src: ['*.hbs'], dest: 'out/examples/input'},
          {expand: true, cwd: 'examples/particles', src: ['*.hbs'], dest: 'out/examples/particles'},
          {expand: true, cwd: 'examples/quadtree', src: ['*.hbs'], dest: 'out/examples/quadtree'},
          {expand: true, cwd: 'examples/sprites', src: ['*.hbs'], dest: 'out/examples/sprites'},
          {expand: true, cwd: 'examples/text', src: ['*.hbs'], dest: 'out/examples/text'},
          {expand: true, cwd: 'examples/texture-crop', src: ['*.hbs'], dest: 'out/examples/texture-crop'},
          {expand: true, cwd: 'examples/tilemaps', src: ['*.hbs'], dest: 'out/examples/tilemaps'},
          {expand: true, cwd: 'examples/tilesprites', src: ['*.hbs'], dest: 'out/examples/tilesprites'},
          {expand: true, cwd: 'examples/tweens', src: ['*.hbs'], dest: 'out/examples/tweens'},
          {expand: true, cwd: 'examples', src: ['index.hbs'], dest: 'out/examples'},
        ]
      }
    }
  });

  grunt.registerTask('build', ['concat:phaser', 'process:phaser', 'uglify:phaser']);
  grunt.registerTask('examples', ['build', 'clean:examples', 'assemble:examples', 'copy:examples']);

  grunt.registerTask('default', ['build']);

};
