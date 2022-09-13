var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin({
        key: 'BannerTextPlugin',
        url: 'assets/loader-tests/BannerTextPlugin.js',
        sceneKey: 'banner'
    });

    this.load.text('3x5', 'assets/loader-tests/3x5.flf');
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
    this.load.spritesheet('tiles', 'assets/tilemaps/tiles/drawtiles.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('chunk', 'assets/sprites/chunk.png');
}

function create ()
{
    this.banner.config('3x5');

    this.banner.createText('Phaser 3', 0, 32, 'balls', 1);

    this.banner.createText('Brings you a new Banner Text Plugin', 0, 140, 'chunk');

    this.banner.createText('PHASER', 0, 300, 'tiles', 5);
}
