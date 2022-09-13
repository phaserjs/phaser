// this.pixelArt = GetValue(config, 'pixelArt', false);
// this.autoResize = GetValue(config, 'autoResize', false);
// this.roundPixels = GetValue(config, 'roundPixels', false);
// this.transparent = GetValue(config, 'transparent', false);
// this.clearBeforeRender = GetValue(config, 'clearBeforeRender', true);


var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    roundPixels: true,
    backgroundColor: '#ffff00',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/baal-loader.png');
}

function create ()
{
    this.add.image(450.5, 350.8, 'pic');
}
