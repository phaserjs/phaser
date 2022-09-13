var config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    _parent: 'phaser-example',
    backgroundColor: '#efefef',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('apple', 'assets/sprites/apple.png');
}

function create ()
{
    var apple = this.add.sprite(100, 100, 'apple');

    apple.setInteractive();

    this.input.setDraggable(apple);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });
}
