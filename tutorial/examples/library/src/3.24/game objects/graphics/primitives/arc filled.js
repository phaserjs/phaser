var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('metal', 'assets/textures/alien-metal.jpg');
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
    var graphics = this.add.graphics();

    graphics.fillStyle(0x00ff00, 1);

    graphics.beginPath();
    graphics.arc(200, 300, 100, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(280), false, 0.01);
    graphics.fillPath();
    graphics.closePath();

    graphics.beginPath();
    graphics.arc(400, 300, 100, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(280), true, 0.01);
    graphics.fillPath();
    graphics.closePath();
}
