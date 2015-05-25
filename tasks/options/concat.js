module.exports = {

    intro: {
        src: require('../manifests/intro').files,
        dest: '<%= modules_dir %>/intro.js'
    },

    pixi: {
        src: require('../manifests/pixi').files,
        dest: '<%= modules_dir %>/pixi.js'
    },

    phaser: {
        src: require('../manifests/phaser').files,
        dest: '<%= modules_dir %>/phaser.js'
    },

    geom: {
        src: require('../manifests/geom').files,
        dest: '<%= modules_dir %>/geom.js'
    },

    core: {
        src: require('../manifests/core').files,
        dest: '<%= modules_dir %>/core.js'
    },

    input: {
        src: require('../manifests/input').files,
        dest: '<%= modules_dir %>/input.js'
    },

    gamepad: {
        src: require('../manifests/gamepad').files,
        dest: '<%= modules_dir %>/gamepad.js'
    },

    keyboard: {
        src: require('../manifests/keyboard').files,
        dest: '<%= modules_dir %>/keyboard.js'
    },

    components: {
        src: require('../manifests/components').files,
        dest: '<%= modules_dir %>/components.js'
    },

    gameobjects: {
        src: require('../manifests/gameobjects').files,
        dest: '<%= modules_dir %>/gameobjects.js'
    },

    bitmapdata: {
        src: require('../manifests/bitmapdata').files,
        dest: '<%= modules_dir %>/bitmapdata.js'
    },

    graphics: {
        src: require('../manifests/graphics').files,
        dest: '<%= modules_dir %>/graphics.js'
    },

    rendertexture: {
        src: require('../manifests/rendertexture').files,
        dest: '<%= modules_dir %>/rendertexture.js'
    },

    text: {
        src: require('../manifests/text').files,
        dest: '<%= modules_dir %>/text.js'
    },

    bitmaptext: {
        src: require('../manifests/bitmaptext').files,
        dest: '<%= modules_dir %>/bitmaptext.js'
    },

    retrofont: {
        src: require('../manifests/retrofont').files,
        dest: '<%= modules_dir %>/retrofont.js'
    },

    system: {
        src: require('../manifests/system').files,
        dest: '<%= modules_dir %>/system.js'
    },

    math: {
        src: require('../manifests/math').files,
        dest: '<%= modules_dir %>/math.js'
    },

    net: {
        src: require('../manifests/net').files,
        dest: '<%= modules_dir %>/net.js'
    },

    netStub: {
        src: require('../manifests/net').stubs,
        dest: '<%= modules_dir %>/net.js'
    },

    tweens: {
        src: require('../manifests/tweens').files,
        dest: '<%= modules_dir %>/tweens.js'
    },

    tweensStub: {
        src: require('../manifests/tweens').stubs,
        dest: '<%= modules_dir %>/tweens.js'
    },

    time: {
        src: require('../manifests/time').files,
        dest: '<%= modules_dir %>/time.js'
    },

    animation: {
        src: require('../manifests/animation').files,
        dest: '<%= modules_dir %>/animation.js'
    },

    loader: {
        src: require('../manifests/loader').files,
        dest: '<%= modules_dir %>/loader.js'
    },

    sound: {
        src: require('../manifests/sound').files,
        dest: '<%= modules_dir %>/sound.js'
    },

    soundStub: {
        src: require('../manifests/sound').stubs,
        dest: '<%= modules_dir %>/sound.js'
    },

    debug: {
        src: require('../manifests/debug').files,
        dest: '<%= modules_dir %>/debug.js'
    },

    debugStub: {
        src: require('../manifests/debug').stubs,
        dest: '<%= modules_dir %>/debug.js'
    },

    utils: {
        src: require('../manifests/utils').files,
        dest: '<%= modules_dir %>/utils.js'
    },

    physics: {
        src: require('../manifests/physics').files,
        dest: '<%= modules_dir %>/physics.js'
    },

    arcade: {
        src: require('../manifests/physics.arcade').files,
        dest: '<%= modules_dir %>/arcade.js'
    },

    arcadeTilemaps: {
        src: require('../manifests/physics.arcade.tilemaps').files,
        dest: '<%= modules_dir %>/arcadeTilemaps.js'
    },

    ninja: {
        src: require('../manifests/physics.ninja').files,
        dest: '<%= modules_dir %>/ninja.js'
    },

    p2: {
        src: require('../manifests/physics.p2').files,
        dest: '<%= modules_dir %>/p2.js'
    },

    tilemaps: {
        src: require('../manifests/tilemaps').files,
        dest: '<%= modules_dir %>/tilemaps.js'
    },

    particles: {
        src: require('../manifests/particles').files,
        dest: '<%= modules_dir %>/particles.js'
    },

    particlesStub: {
        src: require('../manifests/particles').stubs,
        dest: '<%= modules_dir %>/particles.js'
    },

    creature: {
        src: require('../manifests/creature').files,
        dest: '<%= modules_dir %>/creature.js'
    },

    video: {
        src: require('../manifests/video').files,
        dest: '<%= modules_dir %>/video.js'
    },

    outro: {
        src: require('../manifests/outro').files,
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
        dest: '<%= compile_dir %>/<%= filename %>.js'
    }

};
