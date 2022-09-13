var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    Phaser.GameObjects.GameObject.prototype.tween = function (config)
    {
        return this.scene.tweens.add({
            ...config,
            targets: this
        });
    }

    const block = this.add.image(100, 100, 'block');

    block.tween({ x: 600, duration: 1000 });
}
