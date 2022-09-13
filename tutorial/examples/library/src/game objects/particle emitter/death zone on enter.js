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
    //  Any particles that enter this shape will be killed instantly
    var rect = new Phaser.Geom.Rectangle(200, 350, 400, 200);

    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: [ 'red', 'green', 'blue' ],
        x: 400,
        y: 100,
        speed: 300,
        gravityY: 400,
        lifespan: 4000,
        scale: 0.4,
        blendMode: 'ADD',
        deathZone: { type: 'onEnter', source: rect }
    });

    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0x00ff00, 1);

    graphics.strokeRectShape(rect);

}
