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
    var path = new Phaser.Curves.Path(400, 300).circleTo(100).moveTo(400, 300).circleTo(100, true, 180);

    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: { frames: [ 'red', 'green', 'blue' ], cycle: true },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: path, quantity: 48, yoyo: false }
    });
}
