var config = {
    type: Phaser.WEBGL,
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
    this.load.image('pixel', 'assets/sprites/16x16.png');
}

function create ()
{
    this.add.image(300, 300, 'pixel').setTint(0xff0000);
    this.add.image(400, 300, 'pixel').setTint(0x00ff00);
    this.add.image(500, 300, 'pixel').setTint(0x0000ff);
}
