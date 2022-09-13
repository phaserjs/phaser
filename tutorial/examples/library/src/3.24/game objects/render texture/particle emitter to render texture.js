var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt;
var particles;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    particles = this.add.particles('flares');

    particles.createEmitter({
        frame: 'blue',
        x: 400,
        y: 300,
        lifespan: 2000,
        speed: { min: 400, max: 600 },
        angle: 0,
        gravityY: 300,
        scale: { start: 0.4, end: 0 },
        quantity: 2,
        blendMode: 'ADD'
    });

    particles.setVisible(false);

    rt = this.add.renderTexture(0, 0, 800, 600);
}

function update ()
{
    rt.camera.rotation -= 0.01;

    rt.clear();

    rt.draw(particles, 0, 0);
}
