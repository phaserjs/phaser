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
    this.load.setPath('assets/pics/');
    this.load.image('taikodrummaster', 'taikodrummaster.jpg');
    this.load.image('sukasuka-chtholly', 'http://labs.phaser.io/assets/pics/sukasuka-chtholly.png');
}

function create ()
{
    this.add.image(400, 300, 'taikodrummaster');
    this.add.image(400, 300, 'sukasuka-chtholly');
}
