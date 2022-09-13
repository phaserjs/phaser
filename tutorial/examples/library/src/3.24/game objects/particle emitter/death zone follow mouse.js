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

var graphics;
var deathZone;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    var emitZone = new Phaser.Geom.Rectangle(0, 0, 800, 600);

    //  Any particles that enter this shape will be killed instantly
    deathZone = new Phaser.Geom.Circle(0, 0, 48);

    var particles = this.add.particles('flares');

    var emitter = particles.createEmitter({
        frame: [ 'red', 'green', 'blue' ],
        speed: { min: -20, max: 20 },
        lifespan: 10000,
        quantity: 2,
        scale: { min: 0.1, max: 0.4 },
        alpha: { start: 1, end: 0 },
        blendMode: 'ADD',
        emitZone: { source: emitZone },
        deathZone: { type: 'onEnter', source: deathZone }
    });

    graphics = this.add.graphics();

    this.input.on('pointermove', function (pointer) {

        deathZone.x = pointer.x;
        deathZone.y = pointer.y;

    });
}

function update ()
{
    graphics.clear();

    graphics.lineStyle(1, 0x00ff00, 1);

    graphics.strokeCircleShape(deathZone);
}
