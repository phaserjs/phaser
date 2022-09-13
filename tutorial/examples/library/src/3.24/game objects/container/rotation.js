var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var container;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('lemming', 'assets/sprites/lemming.png');
}

function create ()
{
    //  Here we've got 1 of each game object:
    var image = this.add.image(0, 0, 'lemming');
    var text = this.add.text(60, 0, 'Oh No!', { font: '16px Courier', fill: '#00ff00' });

    container = this.add.container(200, 300, [ image, text ]);
}

function update ()
{
    container.rotation += 0.01;
}
