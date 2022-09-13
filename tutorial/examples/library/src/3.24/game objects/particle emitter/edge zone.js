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
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    var shape1 = new Phaser.Geom.Circle(0, 0, 160);
    var shape2 = new Phaser.Geom.Ellipse(0, 0, 500, 150);
    var shape3 = new Phaser.Geom.Rectangle(-150, -150, 300, 300);
    var shape4 = new Phaser.Geom.Line(-150, -150, 150, 150);
    var shape5 = new Phaser.Geom.Triangle.BuildEquilateral(0, -140, 300);
    var shapes = [ shape1, shape2, shape3, shape4, shape5 ];

    var i = 0;

    var particles = this.add.particles('flares');

    var emitter = particles.createEmitter({
        frame: { frames: [ 'red', 'green', 'blue' ], cycle: true },
        x: 400,
        y: 300,
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: shape1, quantity: 48, yoyo: false }
    });

    this.input.on('pointerdown', function (pointer) {

        i++;

        if (i === shapes.length)
        {
            i = 0;
        }

        emitter.setEmitZone({ type: 'edge', source: shapes[i], quantity: 48, yoyo: false });

    });
}
