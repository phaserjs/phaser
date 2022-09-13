var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprites = [];
var circ;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('flower', 'assets/sprites/flower-exo.png');
    this.load.image('mushroom', 'assets/sprites/mushroom16x16.png');
}

function create ()
{
    for (var i = 0; i < 240; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        var block = this.physics.add.image(pos.x, pos.y, 'mushroom');

        block.setBounce(1).setCollideWorldBounds(true);

        Phaser.Math.RandomXY(block.body.velocity, 100);

        sprites.push(block);
    }

    sprites.push(this.physics.add.staticImage(400, 300, 'flower'));

    circ = this.add.circle(400, 300, 150).setStrokeStyle(2, 0xffff00);

    this.input.on('pointermove', function (pointer) {

        circ.x = pointer.x;
        circ.y = pointer.y;

    }, this);
}

function update (time, delta)
{
    Phaser.Actions.SetAlpha(sprites, 0.5);

    var bodies = this.physics.overlapCirc(circ.x, circ.y, circ.radius, true, true);

    Phaser.Actions.SetAlpha(bodies.map((body) => body.gameObject), 1);
}
