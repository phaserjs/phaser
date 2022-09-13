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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    this.input.on('pointerdown', function (pointer) {

        console.log(this.game.loop.frame, 'down B');

        this.add.image(pointer.x, pointer.y, 'balls', Phaser.Math.Between(0, 5));

    }, this);
}

function update ()
{
    var p = this.input.activePointer;

    text.setText([
        'x: ' + p.x,
        'y: ' + p.y,
        'duration: ' + p.getDuration()
    ]);
}
