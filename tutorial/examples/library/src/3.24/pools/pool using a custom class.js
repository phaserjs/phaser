var config = {
    type: Phaser.AUTO,
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
var info;
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
    //  A sample custom class with its own 'update' and 'fire' methods
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(500, 1);
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

    info = this.add.text(0, 0, 'Click to add objects', { fill: '#00ff00' });

    //  Set the custom class type that this Group will create.
    //  Limited to just 10 objects in the pool, not allowed to grow beyond it.
    //  runChildUpdate tells the Group to call 'update' on any active child. The default is false.

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 10,
        runChildUpdate: true
    });

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

    info.setText([
        'Used: ' + bullets.getTotalUsed(),
        'Free: ' + bullets.getTotalFree()
    ]);
}
