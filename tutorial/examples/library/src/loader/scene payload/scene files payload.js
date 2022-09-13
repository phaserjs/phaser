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
            { type: 'image', key: 'sonic', url: 'assets/sprites/sonic_havok_sanity.png' },
            { type: 'atlas', key: 'megaset', textureURL: 'assets/atlas/megaset-0.png', atlasURL: 'assets/atlas/megaset-0.json'}
        ]
    }
};

var gameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: sceneConfig
};

var game = new Phaser.Game(gameConfig);

function preload ()
{
    //  You can still preload other assets too
    this.load.image('face', 'assets/pics/bw-face.png');
}

function create ()
{
    this.add.image(400, 300, 'face');
    this.add.image(400, 300, 'sonic');

    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        this.add.image(x, y, 'megaset', frames[i]);
    }
}
