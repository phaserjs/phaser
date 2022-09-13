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
    var shape1 = new Phaser.Geom.Circle(0, 0, 100);
    var shape2 = new Phaser.Geom.Ellipse(0, 0, 500, 150);
    var shape3 = new Phaser.Geom.Rectangle(-150, -150, 300, 300);
    var shape4 = new Phaser.Geom.Line(-150, -150, 150, 150);
    var shape5 = new Phaser.Geom.Triangle(0, -200, 200, 200, -200, 200);

    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: [ 'red', 'yellow', 'green', 'blue' ],
        x: 400, y: 300,
        speed: 90,
        lifespan: 3000,
        quantity: 48,
        frequency: 2000,
        delay: 1000,
        scale: { start: 0.4, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: shape5, quantity: 48 }
    });
}
