var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            setBounds: {
                x: 0,
                y: 0,
                width: 3200,
                height: 600,
                thickness: 32
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            minimap: null,
            player: null,
            cursors: null,
            thrust: null,
            flares: null,
            bullets: null,
            lastFired: 0,
            text: null,
            createBulletEmitter: createBulletEmitter,
            createStarfield: createStarfield,
            createLandscape: createLandscape,
            createAliens: createAliens,
            createThrustEmitter: createThrustEmitter
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('star', 'assets/demoscene/star2.png');
    this.load.image('bigStar', 'assets/demoscene/star3.png');
    this.load.image('ship', 'assets/sprites/shmup-ship2.png');
    this.load.image('bullet', 'assets/sprites/bullets/bullet6.png');
    this.load.image('jets', 'assets/particles/blue.png');
    this.load.image('flares', 'assets/particles/yellow.png');
    this.load.spritesheet('face', 'assets/sprites/metalface78x92.png', { frameWidth: 78, frameHeight: 92 });
}

function create ()
{
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = 0;
            this.born = 0;
        },

        fire: function (player)
        {
            this.setPosition(player.x, player.y);

            if (player.flipX)
            {
                //  Facing left
                this.speed = Phaser.Math.GetSpeed(-1000 + player.vel.x, 1);
            }
            else
            {
                //  Facing right
                this.speed = Phaser.Math.GetSpeed(1000 + player.vel.x, 1);
            }

            this.born = 0;
        },

        update: function (time, delta)
        {
            this.x += this.speed * delta;

            this.born += delta;

            if (this.born > 1000)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    //  The world is 3200 x 600 in size
    this.cameras.main.setBounds(0, 0, 3200, 600);

    //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
    // this.minimap = this.cameras.add(200, 10, 400, 100).setZoom(0.2);
    // this.minimap.setBackgroundColor(0x002244);
    // this.minimap.scrollX = 1600;
    // this.minimap.scrollY = 300;

    this.createStarfield();
    this.createLandscape();
    this.createAliens();
    this.createThrustEmitter();
    this.createBulletEmitter();

    //  Bullets

    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });

    //  Add a player ship

    this.player = this.impact.add.sprite(1600, 200, 'ship').setDepth(1);
    this.player.setMaxVelocity(1000).setFriction(800, 600).setPassiveCollision();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' }).setDepth(1).setScrollFactor(0);
}

function update (time, delta)
{
    this.thrust.setPosition(this.player.x, this.player.y);

    if (this.cursors.left.isDown)
    {
        this.player.setAccelerationX(-800);
        this.player.flipX = true;
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setAccelerationX(800);
        this.player.flipX = false;
    }
    else
    {
        this.player.setAccelerationX(0);
    }

    if (this.cursors.up.isDown)
    {
        this.player.setAccelerationY(-800);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.setAccelerationY(800);
    }
    else
    {
        this.player.setAccelerationY(0);
    }

    if (this.player.vel.x < 0)
    {
        this.thrust.setPosition(this.thrust.x.propertyValue += (this.player.flipX) ? 16 : -16, this.thrust.y.propertyValue);
        this.thrust.setSpeed(this.player.vel.x / 2);
        this.thrust.emitParticle(16);
    }
    else if (this.player.vel.x > 0)
    {
        this.thrust.setPosition(this.thrust.x.propertyValue += (this.player.flipX) ? 16 : -16, this.thrust.y.propertyValue);
        this.thrust.setSpeed(this.player.vel.x / 2);
        this.thrust.emitParticle(16);
    }

    if (this.cursors.space.isDown && time > this.lastFired)
    {
        var bullet = this.bullets.get();
        bullet.setActive(true);
        bullet.setVisible(true);

        if (bullet)
        {
            bullet.fire(this.player);

            this.lastFired = time + 100;
        }
    }

    //  Emitters to bullets

    this.bullets.children.each(function(b) {
        if (b.active)
        {
            this.flares.setPosition(b.x, b.y);
            this.flares.setSpeed(b.speed + 500 * -1);
            this.flares.emitParticle(1);
        }
    }, this);

    this.text.setText(this.player.vel.x);

    //  Position the center of the camera on the player
    //  We -400 because the camera width is 800px and
    //  we want the center of the camera on the player, not the left-hand side of it
    this.cameras.main.scrollX = this.player.x - 400;

    //  And this camera is 400px wide, so -200
    // this.minimap.scrollX = Phaser.Math.Clamp(this.player.x - 200, 800, 2000);
}

function createBulletEmitter ()
{
    this.flares = this.add.particles('flares').createEmitter({
        x: 1600,
        y: 200,
        angle: { min: 170, max: 190 },
        scale: { start: 0.4, end: 0.2 },
        blendMode: 'ADD',
        lifespan: 500,
        on: false
    });
}

function createThrustEmitter ()
{
    this.thrust = this.add.particles('jets').createEmitter({
        x: 1600,
        y: 200,
        angle: { min: 160, max: 200 },
        scale: { start: 0.2, end: 0 },
        blendMode: 'ADD',
        lifespan: 600,
        on: false
    });
}

function createStarfield ()
{
    //  Starfield background

    //  Note the scrollFactor values which give them their 'parallax' effect

    var group = this.add.group({ key: 'star', frameQuantity: 256 });

    group.createMultiple({ key: 'bigStar', frameQuantity: 32 });

    var rect = new Phaser.Geom.Rectangle(0, 0, 3200, 550);

    Phaser.Actions.RandomRectangle(group.getChildren(), rect);

    group.children.iterate(function (child, index) {

        var sf = Math.max(0.3, Math.random());

        if (child.texture.key === 'bigStar')
        {
            sf = 0.2;
        }

        child.setScrollFactor(sf);

        // this.minimap.ignore(child);

    }, this);
}

function createLandscape ()
{
    //  Draw a random 'landscape'

    var landscape = this.add.graphics();

    landscape.fillStyle(0x008800, 1);
    landscape.lineStyle(2, 0x00ff00, 1);

    landscape.beginPath();

    var maxY = 550;
    var minY = 400;

    var x = 0;
    var y = maxY;
    var range = 0;

    var up = true;

    landscape.moveTo(0, 600);
    landscape.lineTo(0, 550);

    do
    {
        //  How large is this 'side' of the mountain?
        range = Phaser.Math.Between(20, 100);

        if (up)
        {
            y = Phaser.Math.Between(y, minY);
            up = false;
        }
        else
        {
            y = Phaser.Math.Between(y, maxY);
            up = true;
        }

        landscape.lineTo(x + range, y);

        x += range;

    } while (x < 3100);

    landscape.lineTo(3200, maxY);
    landscape.lineTo(3200, 600);
    landscape.closePath();

    landscape.strokePath();
    landscape.fillPath();
}

function createAliens ()
{
    //  Create some random aliens moving slowly around

    var config = {
        key: 'metaleyes',
        frames: this.anims.generateFrameNumbers('face', { start: 0, end: 4 }),
        frameRate: 20,
        repeat: -1
    };

    this.anims.create(config);

    for (var i = 0; i < 32; i++)
    {
        var x = Phaser.Math.Between(100, 3100);
        var y = Phaser.Math.Between(100, 300);

        var face = this.impact.add.sprite(x, y, 'face').play('metaleyes');

        face.setLiteCollision().setBounce(1).setBodyScale(0.5);
        face.setVelocity(Phaser.Math.Between(20, 60), Phaser.Math.Between(20, 60));

        if (Math.random() > 0.5)
        {
            face.vel.x *= -1;
        }
        else
        {
            face.vel.y *= -1;
        }
    }
}
