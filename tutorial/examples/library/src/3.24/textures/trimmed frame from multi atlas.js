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
    this.load.path = 'assets/atlas/';

    this.load.multiatlas('megaset', 'tp3-multi-atlas.json');
}

function create ()
{
    this.add.image(400, 300, 'megaset', 'hello');
}
