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

function create ()
{
    var graphics = this.add.graphics();

    graphics.fillStyle(0xffff00, 1);

    graphics.slice(400, 300, 200, Phaser.Math.DegToRad(340), Phaser.Math.DegToRad(20), true);

    graphics.fillPath();
}
