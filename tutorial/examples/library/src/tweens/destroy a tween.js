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
    var image = this.add.image(100, 100, 'block');

    var tween = this.tweens.add({
        targets: image,
        x: 600,
        paused: false,
        yoyo: true,
        repeat: -1
    });

    this.input.once(Phaser.Input.Events.POINTER_DOWN, function () {

        console.log('stopped?');
        tween.stop();

    }, this);

    this.add.text(20, 20, 'Click and see the console');
}
