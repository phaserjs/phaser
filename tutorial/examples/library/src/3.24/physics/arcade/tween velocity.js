class Ship extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y, points)
    {
        super(scene, x, y, 'ship', 2);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2);
        this.play('thrust');

        this.speed = 150;
        this.points = points;

        this.target;
        this.targetIndex = -1;

        this.isSeeking = true;

        this.seek();
    }

    seek ()
    {
        //  Pick a random target point
        var entry = Phaser.Utils.Array.GetRandom(this.points);

        this.target = entry;

        this.isSeeking = false;

        this.scene.tweens.add({
            targets: this.body.velocity,
            x: 0,
            y: 0,
            ease: 'Linear',
            duration: 500,
            onComplete: function (tween, targets, ship)
            {
                ship.isSeeking = true;
                ship.scene.tweens.add({
                    targets: ship,
                    speed: 150,
                    delay: 500,
                    ease: 'Sine.easeOut',
                    duration: 1000
                });
            },
            onCompleteParams: [ this ]
        });
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        //  Is the ship within the radius of the target?
        if (this.target.contains(this.x, this.y))
        {
            this.seek();
        }
        else if (this.isSeeking)
        {
            var angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);

            this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
        }
    }

}

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var g;
var ship;

let game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('ship', 'assets/games/lazer/ship.png', { frameWidth: 16, frameHeight: 24 });
}

function create ()
{
    this.anims.create(
        {
            key: 'thrust',
            frames: this.anims.generateFrameNumbers('ship', { frames: [ 2, 7 ] }),
            frameRate: 20,
            repeat: -1
        });

    let points = [
        new Phaser.Geom.Circle(100, 100, 32),
        new Phaser.Geom.Circle(400, 100, 32),
        new Phaser.Geom.Circle(700, 100, 32),
        new Phaser.Geom.Circle(100, 300, 32),
        new Phaser.Geom.Circle(400, 300, 32),
        new Phaser.Geom.Circle(700, 300, 32),
        new Phaser.Geom.Circle(100, 500, 32),
        new Phaser.Geom.Circle(400, 500, 32),
        new Phaser.Geom.Circle(700, 500, 32)
    ];

    var debug = this.add.graphics();

    debug.lineStyle(1, 0x00ff00);

    points.forEach(function (p)
    {
        debug.strokeCircleShape(p);
    });

    g = this.add.graphics();

    ship = new Ship(this, 400, 300, points);
}

function update ()
{
    g.clear();
    g.fillStyle(0xff0000);
    g.fillRect(ship.target.x, ship.target.y, 4, 4);
}
