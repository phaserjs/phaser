module.exports = {

    //  Our custom version of p2
    p2: {
        src: require('../manifests/p2'),
        dest: '<%= compile_dir %>/p2.js'
    },

    //  Our custom version of Pixi
    pixi: {
        src: require('../manifests/pixi'),
        dest: '<%= compile_dir %>/pixi.js'
    },

    //  Our custom version of Ninja Physics
    ninja: {
        src: require('../manifests/ninja'),
        dest: '<%= compile_dir %>/ninja.js'
    },

    //  Phaser without Pixi, P2 or Ninja Physics (does include Arcade Physics)
    phaser: {
        options: {
            banner: '<%= banner %>'
        },
        src: require('../manifests/phaser'),
        dest: '<%= compile_dir %>/phaser-no-libs.js'
    },

    //  Phaser with Pixi and Arcade Physics, but no Ninja or P2 libs
    phaserArcadePhysics: {
        options: {
            banner: '<%= banner %>'
        },
        src: ['<%= compile_dir %>/pixi.js', '<%= compile_dir %>/phaser-no-libs.js'],
        dest: '<%= compile_dir %>/phaser-arcade-physics.js'
    },

    //  One ring to rule them all
    standalone: {
        options: {
            banner: '<%= banner %>'
        },
        src: [
            '<%= compile_dir %>/pixi.js',
            '<%= compile_dir %>/phaser-no-libs.js',
            '<%= compile_dir %>/ninja.js',
            '<%= compile_dir %>/p2.js'
        ],
        dest: '<%= compile_dir %>/phaser.js'
    }

};
