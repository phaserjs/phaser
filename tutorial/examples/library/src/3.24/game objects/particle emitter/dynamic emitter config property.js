var config = {
    type: Phaser.AUTO,
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
    this.load.image('arrow', 'assets/sprites/arrow.png');
}

function create ()
{
    var particles = this.add.particles('arrow');

    var customAngle = 0;

    this.input.on('pointerup', function () {

        customAngle += 90;

    });

    var emitter = particles.createEmitter({
        x: 400,
        y: 300,
        speed: 180,
        lifespan: 3000,
        rotate: { onEmit: function () { return customAngle; } },
    });

    text = this.add.text(10, 10, 'Click to change particle angle', { font: '16px Courier', fill: '#ffffff' });
}
