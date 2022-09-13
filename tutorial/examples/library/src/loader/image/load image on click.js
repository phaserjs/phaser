var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('buttonBG', 'assets/sprites/button-bg.png');
    this.load.image('buttonText', 'assets/sprites/button-text.png');
}

function create ()
{
    var bg = this.add.image(0, 0, 'buttonBG').setInteractive();
    var text = this.add.image(0, 0, 'buttonText');

    var container = this.add.container(400, 300, [ bg, text ]);

    bg.once('pointerup', loadImage, this);
}

function loadImage ()
{
    this.load.once('complete', addSprites, this);

    this.load.image('pic', 'assets/pics/turkey-1985086.jpg');
    this.load.image('titan', 'assets/pics/titan-mech.png');

    this.load.start();
}

function addSprites ()
{
    this.add.image(400, 300, 'pic');
    this.add.image(400, 300, 'titan');
}
