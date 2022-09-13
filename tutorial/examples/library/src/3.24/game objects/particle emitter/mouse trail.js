var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var darkSmoke = null;
var fire = null;
var whiteSmoke = null;
var spark0 = null;
var spark1 = null;
var move = false;
var t = 0;
var game = new Phaser.Game(config);


function preload ()
{
    this.load.image('dark-smoke', 'assets/particles/smoke-puff.png');
    this.load.image('white-smoke', 'assets/particles/smoke0.png');
    this.load.image('fire', 'assets/particles/muzzleflash3.png');
    this.load.image('spark0', 'assets/particles/blue.png');
    this.load.image('spark1', 'assets/particles/red.png');
}

function create ()
{

    spark0 = this.add.particles('spark0').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -500, max: 500 },
        angle: { min: -120, max: -60 },
        scale: { min: 0.05, max: 0 },
        alpha: { min: 1, max: 0 },
        gravityY: 500,
        lifespan: 1
    });
    spark0.reserve(1000);

    spark1 = this.add.particles('spark1').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -100, max: 100 },
        angle: { min: -120, max: -60 },
        scale: { start: 0, end: 0.4 },
        alpha: { start: 1, end: 0, ease: 'Expo.easeIn' },
        blendMode: 'SCREEN',
        gravityY: 500,
        lifespan: 1000
    });
    spark1.reserve(1000);

    fire = this.add.particles('fire').createEmitter({
        x: 400,
        y: 300,
        speed: { min: 100, max: 200 },
        angle: { min: -85, max: -95 },
        scale: { start: 0, end: 1, ease: 'Back.easeOut' },
        alpha: { start: 1, end: 0, ease: 'Quart.easeOut' },
        blendMode: 'SCREEN',
        lifespan: 1000
    });
    fire.reserve(1000);

    whiteSmoke = this.add.particles('white-smoke').createEmitter({
        x: 400,
        y: 300,
        speed: { min: 20, max: 100 },
        angle: { min: 0, max: 360},
        scale: { start: 1, end: 0},
        alpha: { start: 0, end: 0.5},
        lifespan: 2000,
        //active: false
    });
    whiteSmoke.reserve(1000);

    darkSmoke = this.add.particles('dark-smoke').createEmitter({
        x: 400,
        y: 300,
        speed: { min: 20, max: 100 },
        angle: { min: 0, max: 360},
        scale: { start: 1, end: 0},
        alpha: { start: 0, end: 0.1},
        blendMode: 'ADD',
        lifespan: 2000,
        //active: false
    });
    darkSmoke.reserve(1000);

    fire.onParticleDeath(function (particle) {
        darkSmoke.setPosition(particle.x, particle.y);
        whiteSmoke.setPosition(particle.x, particle.y);
        darkSmoke.emitParticle();
        whiteSmoke.emitParticle();
    });

    this.input.on('pointermove', function (pointer) {
        darkSmoke.setPosition(pointer.x, pointer.y);
        fire.setPosition(pointer.x, pointer.y);
    });

}

function update ()
{

    spark0.x = fire.x;
    spark0.y = fire.y;
    spark1.x = fire.x;
    spark1.y = fire.y;
}