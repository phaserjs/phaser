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
    this.load.image('spark', 'assets/particles/blue.png');
}

function create ()
{
    var emitter = this.add.particles('spark').createEmitter({
        x: 400,
        y: 300,
        blendMode: 'SCREEN',
        scale: { start: 0.2, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 50
    });

    var emitZones = [];

    emitZones.push({
        source: new Phaser.Geom.Circle(0, 0, 100),
        type: 'edge',
        quantity: 50
    });
    emitZones.push({
        source: new Phaser.Geom.Ellipse(0, 0, 400, 100),
        type: 'edge',
        quantity: 50
    });
    emitZones.push({
        source: new Phaser.Geom.Rectangle(-150, -150, 300, 300),
        type: 'edge',
        quantity: 50
    });
    emitZones.push({
        source: new Phaser.Geom.Line(-150, -150, 150, 150),
        type: 'edge',
        quantity: 50
    });
    emitZones.push({
        source: new Phaser.Geom.Triangle(0, -200, 200, 200, -200, 200),
        type: 'edge',
        quantity: 50
    });

    var emitZoneIndex = 0;

    this.input.on('pointermove', function (pointer) {
        emitter.setPosition(pointer.x, pointer.y)
    });

    this.input.on('pointerdown', function (pointer) {
        emitZoneIndex = (emitZoneIndex + 1) % emitZones.length;
        emitter.setEmitZone(emitZones[emitZoneIndex]);
        emitter.explode();
    });

    emitter.setEmitZone(emitZones[emitZoneIndex]);
}
