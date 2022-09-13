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

var blocks = [];
var rect;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom16x16.png');
}

function create ()
{
    var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -20, -20);

    for (var i = 0; i < 500; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

        var block = this.physics.add.sprite(pos.x, pos.y, 'mushroom');

        block.setVelocity(Phaser.Math.Between(50, 100), Phaser.Math.Between(50, 100));
        block.setBounce(1).setCollideWorldBounds(true);

        if (Math.random() > 0.5)
        {
            block.body.velocity.x *= -1;
        }
        else
        {
            block.body.velocity.y *= -1;
        }

        blocks.push(block);
    }

    rect = this.add.rectangle(400, 300, 300, 200).setStrokeStyle(2, 0xffff00);

    this.input.on('pointermove', function (pointer) {

        rect.x = pointer.x;
        rect.y = pointer.y;

    }, this);
}

function update (time, delta)
{
    blocks.forEach(function (block) {
        block.setTint(0xffffff);
    });

    //  We need the top-left of the rect
    var x = rect.x - (rect.width / 2);
    var y = rect.y - (rect.height / 2);

    var within = this.physics.overlapRect(x, y, rect.width, rect.height);

    within.forEach(function (body) {
        body.gameObject.setTint(0xff0000);
    });
}
