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
    this.load.image('soil', 'assets/textures/soil.png');
}

function create ()
{
    var soil = this.add.tileSprite(400, 300, 800, 600, 'soil');

    this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {

        soil.tilePositionX += deltaX * 0.5;
        soil.tilePositionY += deltaY * 0.5;

    });

    this.add.text(10, 10, 'Scroll your mouse-wheel', { font: '16px Courier', fill: '#00ff00' });
}
