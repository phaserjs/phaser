var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0xffffff, 1);
    graphics.strokeTriangle(200, 200, 400, 50, 500, 300);

    graphics.lineStyle(4, 0x00ffff, 1);
    graphics.strokeTriangle(60, 500, 60, 400, 500, 500);
}
