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
    //  Any particles that leave this shape will be killed instantly
    var circle = new Phaser.Geom.Circle(400, 300, 200);

    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: [ 'red', 'green', 'blue' ],
        x: 400,
        y: 300,
        speed: 300,
        lifespan: 4000,
        scale: 0.4,
        blendMode: 'ADD',
        deathZone: { type: 'onLeave', source: circle }
    });

    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0x00ff00, 1);

    graphics.strokeCircleShape(circle);
}
