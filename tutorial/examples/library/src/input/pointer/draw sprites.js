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
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    this.input.on('pointermove', function (pointer) {

        if (pointer.isDown)
        {
            this.add.image(pointer.x, pointer.y, 'balls', Phaser.Math.Between(0, 5));
        }

    }, this);
}
