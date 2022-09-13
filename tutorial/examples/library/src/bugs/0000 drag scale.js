var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    var container1 = this.add.container(400, 300);
    var container2 = this.add.container(0, 0);

    container1.setScale(0.5);

    var sprite = this.add.image(0, 0, 'eye').setInteractive();

    container1.add(container2);
    container2.add(sprite);

    this.input.setDraggable(sprite);

    sprite.on('drag', (pointer, dragX, dragY) => {

        sprite.x = dragX;
        sprite.y = dragY;

    });
}
