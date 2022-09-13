var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var followTarget;
var particles;
var moveCam = false;
var speed = 5;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/pics/uv-grid-diag.png');
    this.load.image('block', 'assets/sprites/block.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    this.cameras.main.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);

    this.add.image(-1024, -1024, 'bg').setOrigin(0);
    this.add.image(0, -1024, 'bg').setOrigin(0);
    this.add.image(-1024, 0, 'bg').setOrigin(0);
    this.add.image(0, 0, 'bg').setOrigin(0);

    cursors = this.input.keyboard.createCursorKeys();

    followTarget = this.add.image(0, 0, 'block');

    this.cameras.main.startFollow(followTarget, true);

    particles = this.add.particles('flares');

    var emitter = particles.createEmitter({
        frame: 'blue',
        x: 64,
        y: 0,
        lifespan: 2000,
        speed: { min: 400, max: 600 },
        angle: 330,
        gravityY: 300,
        scale: { start: 0.4, end: 0 },
        quantity: 2,
        blendMode: 'ADD'
    });

    emitter.startFollow(followTarget);
}

function update ()
{
    if (cursors.left.isDown)
    {
        followTarget.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        followTarget.x += 4;
    }

    if (cursors.up.isDown)
    {
        followTarget.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        followTarget.y += 4;
    }

    particles.angle -= 2;
}
