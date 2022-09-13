var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('poo', 'assets/sprites/poo.png');
}

function create ()
{
    this.add.text(10, 10, 'Scroll your mouse-wheel up and down over the sprite', { font: '16px Courier', fill: '#00ff00' });

    var poo = this.add.image(400, 300, 'poo').setInteractive();

    poo.on('wheel', function (pointer, deltaX, deltaY, deltaZ) {

        this.scale += deltaY * -0.001;

    });
}
