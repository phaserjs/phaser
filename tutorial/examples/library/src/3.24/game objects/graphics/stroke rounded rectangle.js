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

    graphics.lineStyle(2, 0xffff00, 1);

    //  32px radius on the corners
    graphics.strokeRoundedRect(32, 32, 300, 200, 32);

    graphics.lineStyle(4, 0xff00ff, 1);

    //  Using an object to define a different radius per corner
    graphics.strokeRoundedRect(360, 240, 400, 300, { tl: 64, tr: 22, bl: 12, br: 0 });
}
