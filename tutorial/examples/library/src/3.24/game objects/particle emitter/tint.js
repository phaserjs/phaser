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
    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: 'white',
        x: 400,
        y: 300,
        speed: 100,
        tint: [ 0xffff00, 0xff0000, 0x00ff00, 0x0000ff ],
        lifespan: 2000,
        frequency: 50,
        blendMode: 'ADD'
    });
}
