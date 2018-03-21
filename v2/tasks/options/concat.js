module.exports = {

    creatureGlobal: {
        src: require('../manifests/creature-global'),
        dest: '<%= modules_dir %>/creature-global.js'
    },

    creatureGlobalSplit: {
        src: require('../manifests/creature-global'),
        dest: '<%= compile_dir %>/creature.js'
    },

    creature: {
        src: require('../manifests/creature'),
        dest: '<%= modules_dir %>/creature.js'
    },

    p2Global: {
        src: require('../manifests/p2'),
        dest: '<%= modules_dir %>/p2-global.js'
    },

    p2GlobalSplit: {
        src: require('../manifests/p2'),
        dest: '<%= compile_dir %>/p2.js'
    },

    pixiIntro: {
        src: require('../manifests/pixi-intro'),
        dest: '<%= modules_dir %>/pixi-intro.js'
    },

    pixiMain: {
        src: require('../manifests/pixi-main'),
        dest: '<%= modules_dir %>/pixi-main.js'
    },
    
    pixiRope: {
        src: require('../manifests/pixi-rope'),
        dest: '<%= modules_dir %>/pixi-rope.js'
    },

    pixiTileSprite: {
        src: require('../manifests/pixi-tilesprite'),
        dest: '<%= modules_dir %>/pixi-tilesprite.js'
    },

    pixiOutro: {
        src: require('../manifests/pixi-outro'),
        dest: '<%= modules_dir %>/pixi-outro.js'
    },

    intro: {
        src: require('../manifests/intro'),
        dest: '<%= modules_dir %>/intro.js'
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

    netStub: {
        src: require('../manifests/net.stub'),
        dest: '<%= modules_dir %>/net.js'
    },

    tweens: {
        src: require('../manifests/tweens'),
        dest: '<%= modules_dir %>/tweens.js'
    },

    tweensStub: {
        src: require('../manifests/tweens.stub'),
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

    soundStub: {
        src: require('../manifests/sound.stub'),
        dest: '<%= modules_dir %>/sound.js'
    },

    debug: {
        src: require('../manifests/debug'),
        dest: '<%= modules_dir %>/debug.js'
    },

    debugStub: {
        src: require('../manifests/debug.stub'),
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

    weapon: {
        src: require('../manifests/physics.arcade.weapon'),
        dest: '<%= modules_dir %>/weapon.js'
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

    particlesStub: {
        src: require('../manifests/particles.stub'),
        dest: '<%= modules_dir %>/particles.js'
    },

    scale: {
        src: require('../manifests/scale'),
        dest: '<%= modules_dir %>/scale.js'
    },

    scaleStub: {
        src: require('../manifests/scale.stub'),
        dest: '<%= modules_dir %>/scale.js'
    },

    dom: {
        src: require('../manifests/dom'),
        dest: '<%= modules_dir %>/dom.js'
    },

    domStub: {
        src: require('../manifests/dom.stub'),
        dest: '<%= modules_dir %>/dom.js'
    },

    color: {
        src: require('../manifests/color'),
        dest: '<%= modules_dir %>/color.js'
    },

    colorStub: {
        src: require('../manifests/color.stub'),
        dest: '<%= modules_dir %>/color.js'
    },

    video: {
        src: require('../manifests/video'),
        dest: '<%= modules_dir %>/video.js'
    },

    rope: {
        src: require('../manifests/rope'),
        dest: '<%= modules_dir %>/rope.js'
    },

    tilesprite: {
        src: require('../manifests/tilesprite'),
        dest: '<%= modules_dir %>/tilesprite.js'
    },

    tilespriteStub: {
        src: require('../manifests/tilesprite.stub'),
        dest: '<%= modules_dir %>/tilesprite.js'
    },

    create: {
        src: require('../manifests/create'),
        dest: '<%= modules_dir %>/create.js'
    },

    createStub: {
        src: require('../manifests/create.stub'),
        dest: '<%= modules_dir %>/create.js'
    },

    flexgrid: {
        src: require('../manifests/flexgrid'),
        dest: '<%= modules_dir %>/flexgrid.js'
    },

    pixidefs: {
        src: require('../manifests/pixidefs'),
        dest: '<%= modules_dir %>/pixidefs.js'
    },
    
    outro: {
        src: require('../manifests/outro'),
        dest: '<%= modules_dir %>/outro.js'
    },

    ////////////////////
    //  Custom Builds //
    ////////////////////

    custom: {
        options: {
            banner: '<%= banner %>',
        },
        src: ['<%= filelist %>'],
        dest: '<%= compile_dir %>/<%= filename %>.js'
    },

    pixi: {
        options: {
            banner: '<%= banner %>',
        },
        src: ['<%= pixiFilelist %>'],
        dest: '<%= compile_dir %>/pixi.js'
    }

};
