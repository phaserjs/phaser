module.exports = {

    intro: {
        src: require('../manifests/intro'),
        dest: '<%= modules_dir %>/intro.js'
    },

    pixi: {
        src: require('../manifests/pixi'),
        dest: '<%= modules_dir %>/pixi.js'
    },

    phaser: {
        src: require('../manifests/phaser'),
        dest: '<%= modules_dir %>/phaser.js'
    },

    geom: {
        src: require('../manifests/geom'),
        dest: '<%= modules_dir %>/geom.js'
    },

    core: {
        src: require('../manifests/core'),
        dest: '<%= modules_dir %>/core.js'
    },

    input: {
        src: require('../manifests/input'),
        dest: '<%= modules_dir %>/input.js'
    },

    gamepad: {
        src: require('../manifests/gamepad'),
        dest: '<%= modules_dir %>/gamepad.js'
    },

    keyboard: {
        src: require('../manifests/keyboard'),
        dest: '<%= modules_dir %>/keyboard.js'
    },

    components: {
        src: require('../manifests/components'),
        dest: '<%= modules_dir %>/components.js'
    },

    gameobjects: {
        src: require('../manifests/gameobjects'),
        dest: '<%= modules_dir %>/gameobjects.js'
    },

    bitmapdata: {
        src: require('../manifests/bitmapdata'),
        dest: '<%= modules_dir %>/bitmapdata.js'
    },

    graphics: {
        src: require('../manifests/graphics'),
        dest: '<%= modules_dir %>/graphics.js'
    },

    rendertexture: {
        src: require('../manifests/rendertexture'),
        dest: '<%= modules_dir %>/rendertexture.js'
    },

    text: {
        src: require('../manifests/text'),
        dest: '<%= modules_dir %>/text.js'
    },

    bitmaptext: {
        src: require('../manifests/bitmaptext'),
        dest: '<%= modules_dir %>/bitmaptext.js'
    },

    retrofont: {
        src: require('../manifests/retrofont'),
        dest: '<%= modules_dir %>/retrofont.js'
    },

    system: {
        src: require('../manifests/system'),
        dest: '<%= modules_dir %>/system.js'
    },

    math: {
        src: require('../manifests/math'),
        dest: '<%= modules_dir %>/math.js'
    },

    net: {
        src: require('../manifests/net'),
        dest: '<%= modules_dir %>/net.js'
    },

    tweens: {
        src: require('../manifests/tweens'),
        dest: '<%= modules_dir %>/tweens.js'
    },

    time: {
        src: require('../manifests/time'),
        dest: '<%= modules_dir %>/time.js'
    },

    animation: {
        src: require('../manifests/animation'),
        dest: '<%= modules_dir %>/animation.js'
    },

    loader: {
        src: require('../manifests/loader'),
        dest: '<%= modules_dir %>/loader.js'
    },

    sound: {
        src: require('../manifests/sound'),
        dest: '<%= modules_dir %>/sound.js'
    },

    debug: {
        src: require('../manifests/debug'),
        dest: '<%= modules_dir %>/debug.js'
    },

    utils: {
        src: require('../manifests/utils'),
        dest: '<%= modules_dir %>/utils.js'
    },

    physics: {
        src: require('../manifests/physics'),
        dest: '<%= modules_dir %>/physics.js'
    },

    arcade: {
        src: require('../manifests/physics.arcade'),
        dest: '<%= modules_dir %>/arcade.js'
    },

    arcadeTilemaps: {
        src: require('../manifests/physics.arcade.tilemaps'),
        dest: '<%= modules_dir %>/arcadeTilemaps.js'
    },

    ninja: {
        src: require('../manifests/physics.ninja'),
        dest: '<%= modules_dir %>/ninja.js'
    },

    p2: {
        src: require('../manifests/physics.p2'),
        dest: '<%= modules_dir %>/p2.js'
    },

    tilemaps: {
        src: require('../manifests/tilemaps'),
        dest: '<%= modules_dir %>/tilemaps.js'
    },

    particles: {
        src: require('../manifests/particles'),
        dest: '<%= modules_dir %>/particles.js'
    },

    outro: {
        src: require('../manifests/outro'),
        dest: '<%= modules_dir %>/outro.js'
    },

    ///////////////////
    //  Custom Build //
    ///////////////////

    custom: {
        options: {
            banner: '<%= banner %>',
        },
        src: ['<%= filelist %>'],
        dest: '<%= compile_dir %>/phaser-custom.js'
    },

    /*

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

    //  Phaser with Pixi, Arcade Physics and Ninja Physics, but no p2 libs
    phaserNinjaPhysics: {
        options: {
            banner: '<%= banner %>'
        },
        src: ['<%= compile_dir %>/pixi.js', '<%= compile_dir %>/phaser-no-libs.js', '<%= compile_dir %>/ninja.js'],
        dest: '<%= compile_dir %>/phaser-ninja-physics.js'
    },

    //  Phaser without P2, Ninja Physics or Arcade Physics. Does include Pixi. This is a stand-alone build.
    phaserNoPhysics: {
        options: {
            banner: '<%= banner %>'
        },
        src: ['<%= compile_dir %>/pixi.js', require('../manifests/phaser-nophysics')],
        dest: '<%= compile_dir %>/phaser-no-physics.js'
    },

    //  Phaser with just P2 physics included. Does include Pixi.
    phaserP2Physics: {
        options: {
            banner: '<%= banner %>'
        },
        src: [
            '<%= compile_dir %>/pixi.js',
            require('../manifests/phaser-nophysics'),
            '<%= compile_dir %>/p2.js'
        ],
        dest: '<%= compile_dir %>/phaser-p2-physics.js'
    },

    //  One ring to rule them all
    standalone: {
        options: {
            banner: '<%= banner %>'
        },
        src: [
            '<%= compile_dir %>/pixi.js',
            '<%= compile_dir %>/phaser-no-libs.js',
            '<%= compile_dir %>/p2.js'
        ],
        dest: '<%= compile_dir %>/phaser.js'
    }

    */

};
