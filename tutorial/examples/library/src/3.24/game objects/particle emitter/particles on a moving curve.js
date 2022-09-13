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
    this.load.spritesheet('dragcircle', 'assets/sprites/dragcircle.png', { frameWidth: 16 });
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    var graphics = this.add.graphics();

    var particles = this.add.particles('flares');

    var path = { t: 0, vec: new Phaser.Math.Vector2() };

    var curve = new Phaser.Curves.Spline([
        20, 550,
        260, 450,
        300, 250,
        550, 145,
        745, 256
    ]);

    var emitter = particles.createEmitter({
        frame: 'blue',
        quantity: 48,
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: curve, quantity: 48 }
    });

    //  Create drag-handles for each point

    for (var i = 0; i < curve.points.length; i++)
    {
        var point = curve.points[i];

        var handle = this.add.image(point.x, point.y, 'dragcircle', 0).setInteractive();

        handle.data.set('vector', point);

        this.input.setDraggable(handle);
    }

    this.input.on('dragstart', function (pointer, gameObject) {

        gameObject.setFrame(1);

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

        gameObject.data.get('vector').set(dragX, dragY);

        emitter.emitZone.updateSource();

    });

    this.input.on('dragend', function (pointer, gameObject) {

        gameObject.setFrame(0);

    });
}
