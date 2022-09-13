var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('ball', 'assets/sprites/shinyball.png');
    this.load.image('crate', 'assets/sprites/crate32.png');
}

function create ()
{
    var sprite = this.physics.add.image(400, 300, 'mushroom');

    var outer = new Phaser.Geom.Rectangle(0, 0, 800, 600);
    var inner = new Phaser.Geom.Rectangle(350, 250, 100, 100);

    //  Create a few balls

    // var balls = this.add.group();
    var balls = this.physics.add.group({ immovable: true });

    for (var i = 0; i < 8; i++)
    {
        var p = Phaser.Geom.Rectangle.RandomOutside(outer, inner);
        var b = balls.create(p.x, p.y, 'ball');

        this.physics.add.existing(b);

        b.body.setImmovable();
    }

    //  Create a few crates

    // var balls = this.add.group();
    var crates = this.physics.add.group({ immovable: true });

    for (var i = 0; i < 8; i++)
    {
        var p = Phaser.Geom.Rectangle.RandomOutside(outer, inner);
        var b = crates.create(p.x, p.y, 'crate');

        this.physics.add.existing(b);

        b.body.setImmovable();
    }

    sprite.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true).setGravityY(200);

    // this.physics.add.collider(sprite, balls);

    this.physics.add.collider(sprite, [ balls, crates ]);
}
