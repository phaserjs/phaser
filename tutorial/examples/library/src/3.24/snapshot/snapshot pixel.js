var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pym', 'assets/pics/cougar-face-of-nature.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
    var g = this.add.graphics().setDepth(1);

    this.input.on('pointerdown', function (pointer) {

        this.game.renderer.snapshotPixel(pointer.x, pointer.y, function (pixel)
        {
            g.clear();
            g.fillStyle(pixel.color);
            g.fillRect(0, 0, 128, 128);

        });

    }, this);

    //  Everything from here down is just stuff to display, so you can grab from it

    var bg = this.add.image(400, 300, 'pym').setScale(3);
    bg.texture.setFilter(1);

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}
