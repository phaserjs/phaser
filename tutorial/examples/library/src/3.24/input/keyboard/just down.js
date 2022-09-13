var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#000000',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var spacebar;
var ship;
var bullets;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('space', 'assets/tests/space/nebula.jpg');
    this.load.image('bullet', 'assets/sprites/bullets/bullet10.png');
    this.load.image('ship', 'assets/sprites/shmup-ship2.png');
}

function create ()
{
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(600, 1);
        },

        fire: function (x, y)
        {
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.x += this.speed * delta;

            if (this.x > 820)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 30,
        runChildUpdate: true
    });

    this.add.image(400, 300, 'space');

    ship = this.add.image(100, 300, 'ship').setDepth(1000);

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update ()
{
    if (Phaser.Input.Keyboard.JustDown(spacebar))
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(ship.x, ship.y);
        }
    }
}
