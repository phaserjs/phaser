var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var particles = this.add.particles('flares');
    var block = this.add.image(0, 0, 'block');

    // var container = this.add.container(400, 300, [ particles, block ]);

    particles.createEmitter({
        frame: [ 'red', 'green', 'blue' ],
        x: 0,
        y: 0,
        speed: 300,
        gravityY: 400,
        lifespan: 4000,
        scale: 0.4,
        blendMode: 'ADD'
    });

    this.cameras.main.setZoom(0.5);

    // this.tweens.add({
    //     targets: container,
    //     angle: 360,
    //     duration: 3000,
    //     repeat: -1,
    //     ease: 'Linear'
    // });
}
