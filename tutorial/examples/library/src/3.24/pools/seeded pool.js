var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bullets;
var ship;
var speed;
var stats;
var cursors;
var lastFired = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/sprites/ship.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
}

function create ()
{
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(400, 1);
        },

        fire: function (x, y)
        {
            this.setPosition(x, y - 50);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.y -= this.speed * delta;

            if (this.y < -50)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    //  Limited to 20 objects in the pool, not allowed to grow beyond it
    // bullets = this.pool.createObjectPool(Bullet, 20);

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 20,
        runChildUpdate: true
    });

    //  Create the objects in advance, so they're ready and waiting in the pool
    bullets.createMultiple({ quantity: 20, active: false });

    ship = this.add.sprite(400, 500, 'ship').setDepth(1);

    cursors = this.input.keyboard.createCursorKeys();

    speed = Phaser.Math.GetSpeed(300, 1);
}

function update (time, delta)
{
    if (cursors.left.isDown)
    {
        ship.x -= speed * delta;
    }
    else if (cursors.right.isDown)
    {
        ship.x += speed * delta;
    }

    if (cursors.up.isDown && time > lastFired)
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(ship.x, ship.y);

            lastFired = time + 50;
        }
    }
}
