var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('explosion', 'assets/particles/explosion.png', 'assets/particles/explosion.json');
}

function create ()
{
    var particles = this.add.particles('explosion');

    //  Setting { min: x, max: y } will pick a random value between min and max
    //  Setting { start: x, end: y } will ease between start and end

    particles.createEmitter({
        frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
        angle: { min: 240, max: 300 },
        speed: { min: 200, max: 300 },
        quantity: 6,
        lifespan: 2000,
        alpha: { start: 1, end: 0 },
        scale: { start: 1.5, end: 0.5 },
        on: false
    });

    particles.createEmitter({
        frame: 'red',
        angle: { min: 0, max: 360, steps: 32 },
        lifespan: 1000,
        speed: 400,
        quantity: 32,
        scale: { start: 0.3, end: 0 },
        on: false
    });

    particles.createEmitter({
        frame: 'stone',
        angle: { min: 240, max: 300 },
        speed: { min: 400, max: 600 },
        quantity: { min: 2, max: 10 },
        lifespan: 4000,
        alpha: { start: 1, end: 0 },
        scale: { min: 0.05, max: 0.4 },
        rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
        gravityY: 800,
        on: false
    });

    particles.createEmitter({
        frame: 'muzzleflash2',
        lifespan: 200,
        scale: { start: 2, end: 0 },
        rotate: { start: 0, end: 180 },
        on: false
    });

    this.input.on('pointerdown', function (pointer) {

        particles.emitParticleAt(pointer.x, pointer.y);

    });
}
