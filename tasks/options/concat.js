module.exports = {

    animation: {
        src: require('../manifests/animation'),
        dest: '<%= modules_dir %>/animation.js'
    },

    components: {
        src: require('../manifests/components'),
        dest: '<%= modules_dir %>/components.js'
    },

    core: {
        src: require('../manifests/core'),
        dest: '<%= modules_dir %>/core.js'
    },

    //  Game Objects

    display: {
        src: require('../manifests/gameobjects.display'),
        dest: '<%= modules_dir %>/gameobjects.display.js'
    },

    retrofont: {
        src: require('../manifests/gameobjects.retrofont'),
        dest: '<%= modules_dir %>/gameobjects.retrofont.js'
    },

    text: {
        src: require('../manifests/gameobjects.text'),
        dest: '<%= modules_dir %>/gameobjects.text.js'
    },

    textures: {
        src: require('../manifests/gameobjects.textures'),
        dest: '<%= modules_dir %>/gameobjects.textures.js'
    },

    geom: {
        src: require('../manifests/geom'),
        dest: '<%= modules_dir %>/geom.js'
    },

    //  Input

    input: {
        src: require('../manifests/input'),
        dest: '<%= modules_dir %>/input.js'
    },

    gamepad: {
        src: require('../manifests/input.gamepad'),
        dest: '<%= modules_dir %>/input.gamepad.js'
    },

    keyboard: {
        src: require('../manifests/input.keyboard'),
        dest: '<%= modules_dir %>/input.keyboard.js'
    },

    intro: {
        src: require('../manifests/intro'),
        dest: '<%= modules_dir %>/intro.js'
    },

    loader: {
        src: require('../manifests/loader'),
        dest: '<%= modules_dir %>/loader.js'
    },

    math: {
        src: require('../manifests/math'),
        dest: '<%= modules_dir %>/math.js'
    },

    net: {
        src: require('../manifests/net'),
        dest: '<%= modules_dir %>/net.js'
    },

    outro: {
        src: require('../manifests/outro'),
        dest: '<%= modules_dir %>/outro.js'
    },

    particles: {
        src: require('../manifests/particles'),
        dest: '<%= modules_dir %>/particles.js'
    },

    //  Physics

    physics: {
        src: require('../manifests/physics'),
        dest: '<%= modules_dir %>/physics.js'
    },

    arcadeNoTilemap: {
        src: require('../manifests/physics.arcade.no-tilemap'),
        dest: '<%= modules_dir %>/physics.arcade.no-tilemap.js'
    },

    arcade: {
        src: require('../manifests/physics.arcade.tilemap'),
        dest: '<%= modules_dir %>/physics.arcade.tilemap.js'
    },

    ninja: {
        src: require('../manifests/physics.ninja'),
        dest: '<%= modules_dir %>/physics.ninja.js'
    },

    p2: {
        src: require('../manifests/physics.p2'),
        dest: '<%= modules_dir %>/physics.p2.js'
    },

    pixi: {
        src: require('../manifests/pixi'),
        dest: '<%= modules_dir %>/pixi.js'
    },

    sound: {
        src: require('../manifests/sound'),
        dest: '<%= modules_dir %>/sound.js'
    },

    system: {
        src: require('../manifests/system'),
        dest: '<%= modules_dir %>/system.js'
    },

    tilemaps: {
        src: require('../manifests/tilemaps'),
        dest: '<%= modules_dir %>/tilemaps.js'
    },

    time: {
        src: require('../manifests/time'),
        dest: '<%= modules_dir %>/time.js'
    },

    tweens: {
        src: require('../manifests/tweens'),
        dest: '<%= modules_dir %>/tweens.js'
    },

    utils: {
        src: require('../manifests/utils'),
        dest: '<%= modules_dir %>/utils.js'
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
