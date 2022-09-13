var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    input: {
        gamepad: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            fps: 60,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            checkBulletVsEnemy: checkBulletVsEnemy,
            launchEnemy: launchEnemy,
            hitShip: hitShip,
            hitEnemy: hitEnemy
        }
    }
};

var ship;
var gamepad;
var text;
var bullets;
var enemies;
var lastFired = 0;
var fire;
var xparticles;

var game = new Phaser.Game(config);

var Bullet = new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Image,

    initialize:

    function Bullet (scene)
    {
        Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'space', 'blaster');

        this.setBlendMode(1);
        this.setDepth(1);

        this.speed = 800;
        this.lifespan = 1000;

        this._temp = new Phaser.Math.Vector2();
    },

    fire: function (ship)
    {
        this.lifespan = 1000;

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(ship.body.rotation);
        this.setPosition(ship.x, ship.y);

        this.body.reset(ship.x, ship.y);

        this.body.setSize(10, 10, true);

        var angle = Phaser.Math.DegToRad(ship.body.rotation);

        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
    },

    update: function (time, delta)
    {
        this.lifespan -= delta;

        if (this.lifespan <= 0)
        {
            this.kill();
        }
    },

    kill: function ()
    {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
    }

});

var Enemy = new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Sprite,

    initialize:

    function Enemy (scene)
    {
        Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'mine-sheet');

        this.setDepth(1);

        this.speed = 100;
        this.checkOutOfBounds = false;
        this.target = new Phaser.Math.Vector2();
    },

    launch: function ()
    {
        this.play('mine-anim');

        this.checkOutOfBounds = false;

        var p = Phaser.Geom.Rectangle.RandomOutside(spaceOuter, spaceInner);
        
        spaceInner.getRandomPoint(this.target);

        this.speed = Phaser.Math.Between(100, 400);

        this.setActive(true);
        this.setVisible(true);
        this.setPosition(p.x, p.y);

        this.body.reset(p.x, p.y);

        var angle = Phaser.Math.Angle.BetweenPoints(p, this.target);

        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
    },

    update: function (time, delta)
    {
        var withinGame = spaceInner.contains(this.x, this.y);

        if (!this.checkOutOfBounds && withinGame)
        {
            this.checkOutOfBounds = true;
        }
        else if (this.checkOutOfBounds && !withinGame)
        {
            this.kill();
        }
    },

    kill: function ()
    {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
        this.scene.launchEnemy();
    }

});

function preload ()
{
    this.load.image('background', 'assets/tests/space/nebula.jpg');
    this.load.atlas('space', 'assets/tests/space/space.png', 'assets/tests/space/space.json');
    this.load.atlas('explosion', 'assets/particles/explosion.png', 'assets/particles/explosion.json');
}

function create ()
{
    spaceOuter = new Phaser.Geom.Rectangle(-200, -200, 1200, 1000);
    spaceInner = new Phaser.Geom.Rectangle(0, 0, 800, 600);

    this.textures.addSpriteSheetFromAtlas('mine-sheet', { atlas: 'space', frame: 'mine', frameWidth: 64 });
    this.anims.create({ key: 'mine-anim', frames: this.anims.generateFrameNumbers('mine-sheet', { start: 0, end: 15 }), frameRate: 20, repeat: -1 });

    this.add.tileSprite(400, 300, 800, 600, 'background');
    this.add.image(200, 200, 'space', 'purple-planet').setOrigin(0);

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 30,
        runChildUpdate: true
    });

    ship = this.physics.add.image(400, 300, 'space', 'ship').setDepth(2);

    ship.setDamping(true);
    ship.setDrag(0.95);
    ship.setMaxVelocity(400);

    enemies = this.physics.add.group({
        classType: Enemy,
        maxSize: 60,
        runChildUpdate: true
    });

    text = this.add.text(10, 10, 'Press a button on the Gamepad to use', { font: '16px Courier', fill: '#00ff00' });

    this.input.gamepad.on('down', function (pad, button, index) {

        if (pad.getAxisTotal() < 4)
        {
            text.setText('Gamepad does not have enough axis for a twin-stick demo');
        }
        else
        {
            text.setText('Left Stick to move, Right Stick to shoot');

            pad.setAxisThreshold(0.3);

            gamepad = pad;
        }

    }, this);

    xparticles = this.add.particles('explosion');

    /*
    xparticles.createEmitter({
        frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
        angle: { min: 240, max: 300 },
        speed: { min: 200, max: 300 },
        quantity: 6,
        lifespan: 2000,
        alpha: { start: 1, end: 0 },
        scale: { start: 1.5, end: 0.5 },
        on: false
    });
    */

    xparticles.createEmitter({
        frame: 'red',
        angle: { min: 0, max: 360, steps: 32 },
        lifespan: 1000,
        speed: 400,
        quantity: 32,
        scale: { start: 0.3, end: 0 },
        on: false
    });

    xparticles.createEmitter({
        frame: 'muzzleflash2',
        lifespan: 200,
        scale: { start: 2, end: 0 },
        rotate: { start: 0, end: 180 },
        on: false
    });

    var particles = this.add.particles('space');

    var emitter = particles.createEmitter({
        frame: 'blue',
        speed: 200,
        lifespan: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(ship.body.speed, 0, 400) * 2000;
            }
        },
        alpha: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(ship.body.speed, 0, 400);
            }
        },
        angle: {
            onEmit: function (particle, key, t, value)
            {
                // var v = Phaser.Math.Between(-10, 10);
                var v = 0;
                return (ship.angle - 180) + v;
            }
        },
        scale: { start: 0.6, end: 0 },
        blendMode: 'ADD'
    });

    emitter.startFollow(ship);



    this.physics.add.overlap(bullets, enemies, this.hitEnemy, this.checkBulletVsEnemy, this);

    for (var i = 0; i < 6; i++)
    {
        this.launchEnemy();
    }

    console.log(this.physics.world);
}

function launchEnemy ()
{
    var b = enemies.get();

    if (b)
    {
        b.launch();
    }
}

function checkBulletVsEnemy (bullet, enemy)
{
    return (bullet.active && enemy.active);
}

function hitShip (ship, enemy)
{
}

function hitEnemy (bullet, enemy)
{
    xparticles.emitParticleAt(enemy.x, enemy.y);

    this.cameras.main.shake(500, 0.01);

    bullet.kill();
    enemy.kill();
}

function update (time)
{
    if (!gamepad)
    {
        return;
    }

    text.setText([
        gamepad.leftStick.x,
        ship.body.angularVelocity
    ]);

    ship.setAngularVelocity(300 * gamepad.leftStick.x);

    if (gamepad.leftStick.y <= 0)
    {
        this.physics.velocityFromRotation(ship.rotation, Math.abs(800 * gamepad.leftStick.y), ship.body.acceleration);
    }

    this.physics.world.wrap(ship, 32);

    if (gamepad.A && time > lastFired)
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(ship);

            lastFired = time + 100;
        }
    }
}
