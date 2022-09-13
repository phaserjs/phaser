//  Files specified in the Scene config files payload
//  will be loaded in *before* the Scene is started,
//  meaning they're available before even the Scene.preload function (if set) is called

//  This is perfect for loading in small JSON config files for example,
//  or a tiny amount of preloader assets that the preloader itself needs to use.

var sceneConfig = {
    preload: preload,
    create: create,
    pack: {
        files: [
            { type: 'image', key: 'sonic', url: 'assets/sprites/sonic_havok_sanity.png' }
        ]
    }
};

var gameConfig = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: sceneConfig
};

var game = new Phaser.Game(gameConfig);

function preload() {

    //  You can still preload other assets too
    this.load.image('face', 'assets/pics/bw-face.png');

}

function create() {

    this.add.image(0, 0, 'face');
    this.add.image(0, 0, 'sonic');

}
