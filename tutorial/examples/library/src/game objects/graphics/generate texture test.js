var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    },
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.make.graphics().fillStyle(0x00ff00).fillRect(0, 0, 800, 100);

    graphics.generateTexture('hudbar', 800, 100);

    graphics.destroy();

    this.add.image(400, 300, 'hudbar');
}
