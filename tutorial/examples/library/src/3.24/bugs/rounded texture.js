var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

var graphics;

function create ()
{
    graphics = this.add.graphics();

    graphics.fillStyle(0x1cba76);
    graphics.lineStyle(2, 0xffffff);
    graphics.fillRoundedRect(0, 15, 50, 50);
    graphics.generateTexture('logo2', 50, 65);

    this.add.image(300, 300, 'logo2');
}
